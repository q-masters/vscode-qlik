import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { EntryType } from '@vsqlik/fs/data';
import { ConnectionProvider } from 'projects/extension/connection';
import { interval, from, merge } from 'rxjs';
import { switchMap, map, takeWhile, finalize } from 'rxjs/operators';
import { LogFileProvider } from '@vsqlik/fs/utils/virtual-file.provider';
import { isBoolean } from 'util';

export async function ScriptLoadDataCommand() {

    const logFileProvider = container.resolve(LogFileProvider);
    const document = vscode.window.activeTextEditor?.document;

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

        const fileUri = vscode.Uri.parse('vsqlik-out:load data: ' + app.name);
        const file = logFileProvider.create(fileUri);
        const doc = await vscode.workspace.openTextDocument(fileUri);

        file.writeLn(`load data for ${app.name}`);
        await vscode.window.showTextDocument(doc, {preview: false});

        /** streams and log logic */
        const dataLoad$ = from(application.doReload());
        const message$ = interval(500).pipe(
            switchMap((() => global.getProgress(1))),
            map((data)    => data.qPersistentProgress?.trim() ?? ''),
        );

        let isCompleted = false;

        merge(dataLoad$, message$)
            .pipe(
                takeWhile(() => !isCompleted, true),
                finalize(() => {
                    global.session.close();
                    file.writeLn(`completed`);
                    file.writeLn(``);
                    file.dismiss();
                })
            )
            .subscribe((result) => isBoolean(result)
                ? (isCompleted = true)
                : result.length > 0 ? file.writeLn(result) : void 0
            );

        return doc;
    } catch (error) {
        console.log(error);
    }
}
