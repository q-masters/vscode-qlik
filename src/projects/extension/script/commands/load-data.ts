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

        if (!global || !application) {
            return;
        }

        const out = container.resolve(QlikOutputChannel);
        out.show(true);
        out.appendLine(`>>> ${new Date().toLocaleTimeString()} load data for ${app.name}`);

        let isCompleted = false;
        let isSuccess   = false;

        /** print progress messages */
        interval(500).pipe(
            takeWhile(() => !isCompleted, true),
            concatMap((() => global.getProgress(0))),
            tap((data) => {
                data.qErrorData.forEach((error) => out.appendLine(error.qErrorString));

                if (data.qPersistentProgress.trim().length) {
                    out.appendLine(data.qPersistentProgress.trim());
                }
            }),
            finalize(() => {
                global.session.close();
                out.appendLine(``);

                !isSuccess
                    ? out.appendLine(`load data finished with errors`)
                    : out.appendLine(`load data finished without errors.\napp saved`);

                out.appendLine(`<<<`);
            })
        ).subscribe();

        /** emit one time boolean if completed */
        from(global.configureReload(true, true, false))
            .pipe(
                switchMap(() => application.doReload()),
                switchMap((success: boolean) => {
                    isSuccess = success;
                    return success ? application.doSave() : of(void 0);
                }),
                tap(() => isCompleted = true),
                take(1)
            )
            .subscribe();

    } catch (error) {
        console.log(error);
    }
}
