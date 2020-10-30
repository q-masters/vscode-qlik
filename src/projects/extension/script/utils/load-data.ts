import * as vscode from "vscode";
import { inject, singleton } from "tsyringe";
import { QlikOutputChannel } from "@data/tokens";
import { interval, from, of, Subject } from "rxjs";
import { takeWhile, concatMap, tap, finalize, switchMap, take } from "rxjs/operators";
import { ConnectionProvider } from "@core/public.api";
import { EntryType } from "@vsqlik/fs/data";
import { Application } from "projects/extension/connection/utils/application";

enum LoadDataState {
    PROGRESS,
    SUCCESS,
    ERROR,
    CANCELED
}

@singleton()
export class LoadDataProvider {

    private isCompleted = false;

    private cancel$: Subject<boolean>;

    private state: LoadDataState;

    private errors: EngineAPI.IErrorData[] = [];

    public constructor(
        @inject(QlikOutputChannel) private out: vscode.OutputChannel,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider
    ) {
        this.state = LoadDataState.CANCELED;
        this.cancel$ = new Subject();
    }

    /**
     * runs load data
     */
    public async exec(document: vscode.TextDocument): Promise<void> {

        vscode.commands.executeCommand('setContext', 'VsQlik.Script.DataLoadState', 'progressing');

        const connection = await this.connectionProvider.resolve(document.uri);
        const appEntry   = connection?.fileSystem.parent(document.uri, EntryType.APPLICATION);

        if (!connection || !appEntry) {
            vscode.commands.executeCommand('setContext', 'VsQlik.Script.DataLoadState', 'idle');
            return;
        }

        const app  = await connection.getApplication(appEntry.id);
        this.initDataLoad(app);
    }

    /**
     * cancel current load data
     */
    public stop(): void {
        this.state = LoadDataState.CANCELED;
        this.cancel$.next(true);
    }

    private initDataLoad(app: Application) {
        const time = new Date().toISOString().replace(/T/, ' ').replace(/\..*/, '');

        this.errors = [];
        this.state  = LoadDataState.PROGRESS;
        this.isCompleted = false;

        this.out.show(true);
        this.out.appendLine(`${time}: load data for ${app.appName}`);
        this.out.appendLine('');

        this.loadData(app);
    }

    /**
     * start load data process
     */
    private async loadData(application: Application) {

        const global = application.global;
        const app    = await application.document;

        this.cancel$
            .pipe(take(1))
            .subscribe(() => global.cancelReload());

        /** print progress messages */
        interval(500).pipe(
            takeWhile(() => !this.isCompleted, true),
            concatMap((() => global.getProgress(0))),
            tap((data) => {

                if (data.qErrorData.length) {
                    this.errors.push(...data.qErrorData);
                }

                if (data.qPersistentProgress.trim().length) {
                    this.out.appendLine(data.qPersistentProgress.trim());
                }
            }),
            finalize(() => this.complete())
        ).subscribe();

        /** emit one time boolean if completed */
        from(global.configureReload(true, true, false))
            .pipe(
                switchMap(() => app.doReload()),
                switchMap((success: boolean) => {
                    if (success) {
                        this.state = LoadDataState.SUCCESS;
                        return app.doSave();
                    }
                    return of(false);
                }),
                take(1)
            )
            .subscribe(() => this.isCompleted = true);
    }

    /**
     * print out error messages
     */
    private printErrorMessage(error: EngineAPI.IErrorData): void {
        this.out.appendLine(`The following error occurred:`);
        this.out.appendLine(error.qErrorString);
        this.out.appendLine(``);

        this.out.appendLine(`The error occurred here:`);
        this.out.appendLine(error.qLine);

        this.out.appendLine(``);
        this.out.appendLine(``);
    }

    /**
     * data load has been completed
     */
    private complete() {
        this.out.appendLine(``);

        switch (this.state) {

            case LoadDataState.CANCELED:
                this.out.appendLine(`Data load was aborted.`);
                break;

            case LoadDataState.ERROR:
                this.errors.forEach((error) => this.printErrorMessage(error));
                this.out.appendLine(`Data has not been loaded. Please correct the error and try loading again.`);
                break;

            default:
                this.out.appendLine(`Data has been loaded.\nApp saved.`);
        }

        this.out.appendLine(`<<<`);
        vscode.commands.executeCommand('setContext', 'VsQlik.Script.DataLoadState', 'idle');
    }
}
