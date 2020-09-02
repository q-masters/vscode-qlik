import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { EntryType } from '@vsqlik/fs/data';
import { ConnectionProvider } from 'projects/extension/connection';
import { interval, from, merge } from 'rxjs';
import { switchMap, map, takeWhile, finalize } from 'rxjs/operators';
import { isBoolean } from 'util';
import { QlikOutputChannel } from '@data/tokens';
import { basename } from 'path';

export async function ScriptLoadDataCommand(): Promise<void> {

    const document = getActiveScriptDocument();

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
                    out.appendLine(`<<<`);
                    out.appendLine(``);
                })
            )
            .subscribe((result) => isBoolean(result)
                ? (isCompleted = true)
                : result.length > 0 ? out.appendLine(result) : void 0
            );

    } catch (error) {
        console.log(error);
    }
}

function getActiveScriptDocument(): vscode.TextDocument | undefined {
    let document = vscode.window.activeTextEditor?.document;
    if (document && !isMainQvs(document)) {
        /** get all visible text editors and find the editor which contains the script */
        const visibleTextEditors = vscode.window.visibleTextEditors;
        const editor = visibleTextEditors.filter((editor) => isMainQvs(editor.document));

        if (editor.length === 1) {
            document = editor[0].document;
        } else if (editor.length > 1) {
            vscode.window.showInformationMessage(`found to many active script files. Please focus the script file, which should be executed`);
            return;
        }
    }
    return document;
}

function isMainQvs(document: vscode.TextDocument) {
    return document.uri.scheme === 'qix' && basename(document.uri.fsPath) === 'main.qvs';
}
