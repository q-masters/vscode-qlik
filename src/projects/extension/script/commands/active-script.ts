import * as vscode from "vscode";
import { basename } from "path";

/**
 * resolves active script from open text editor
 */
export function ScriptResolveActiveCommand(): vscode.TextDocument | undefined {
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
