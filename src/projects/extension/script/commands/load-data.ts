import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { EntryType } from '@vsqlik/fs/data';
import { ConnectionProvider } from 'projects/extension/connection';
import { interval, from, of } from 'rxjs';
import { switchMap, takeWhile, finalize, tap, take, concatMap } from 'rxjs/operators';
import { QlikOutputChannel } from '@data/tokens';

export async function ScriptLoadDataCommand(): Promise<void> {

    const document = await vscode.commands.executeCommand<vscode.TextDocument>('VsQlik.Script.ResolveActive');

    if (!document) {
        return;
    }

    const connectionProvider = container.resolve(ConnectionProvider);
    const connection = await connectionProvider.resolve(document.uri);
    const app = connection?.fileSystem.parent(document.uri, EntryType.APPLICATION);

    if (!connection || !app) {
        return;
    }

    try {
        const global = await connection.createSession(true);
        const application = await global?.openDoc(app.id);
        const errors: EngineAPI.IErrorData[] = [];

        if (!global || !application) {
            return;
        }

        const out = container.resolve(QlikOutputChannel);
        out.show(true);
        out.appendLine(`>>> ${new Date().toLocaleTimeString()} load data for ${app.name}`);

        let isCompleted = false;

        /** print progress messages */
        interval(500).pipe(
            takeWhile(() => !isCompleted, true),
            concatMap((() => global.getProgress(0))),
            tap((data) => {
                errors.push(...data.qErrorData);
                if (data.qPersistentProgress.trim().length) {
                    out.appendLine(data.qPersistentProgress.trim());
                }
            }),
            finalize(() => {
                global.session.close();
                out.appendLine(``);

                if (errors.length) {
                    errors.forEach((error) => printErrorMessage(error, out));
                    out.appendLine(`Data has not been loaded. Please correct the error and try loading again.`);
                } else {
                    out.appendLine(`Data has been loaded.\nApp saved.`);
                }

                out.appendLine(`<<<`);
            })
        ).subscribe();

        /** emit one time boolean if completed */
        from(global.configureReload(true, true, false))
            .pipe(
                switchMap(() => application.doReload()),
                switchMap((success: boolean) => success ? application.doSave() : of(void 0)),
                tap(() => isCompleted = true),
                take(1)
            )
            .subscribe();

    } catch (error) {
        console.log(error);
    }
}

function printErrorMessage(error: EngineAPI.IErrorData, out: vscode.OutputChannel): void {

    out.appendLine(`The following error occurred:`);
    out.appendLine(error.qErrorString);
    out.appendLine(``);

    out.appendLine(`The error occurred here:`);
    out.appendLine(error.qLine);

    out.appendLine(``);
    out.appendLine(``);
}
