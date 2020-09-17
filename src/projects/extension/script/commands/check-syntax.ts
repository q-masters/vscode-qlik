import { ConnectionProvider } from "@core/public.api";
import { QixApplicationProvider } from "@core/qix/utils/application.provider";
import { EntryType } from "@vsqlik/fs/data";
import { container } from "tsyringe";
import * as vscode from "vscode";

const appProvider           = container.resolve(QixApplicationProvider);
const connectionProviver    = container.resolve(ConnectionProvider);
const diagnosticsCollection = vscode.languages.createDiagnosticCollection("vsqlik.script_errors");

/**
 * checks the script syntax for a qlik script
 */
export async function CheckScriptSyntax(uri: vscode.Uri): Promise<void> {

    /** get required data, connection, app and the text editor which contains the script */
    const connection = await connectionProviver.resolve(uri);
    const appEntry   = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
    const textEditor = vscode.window.visibleTextEditors.find(
        (editor) => editor.document.uri.toString(true) === uri.toString(true));

    if (!connection || !appEntry || !textEditor) {
        return;
    }

    /** open the app */
    const app = await appProvider.openApp(connection, appEntry.id);
    if (!app) {
        vscode.window.showInformationMessage(`check syntax for file: ${uri.toString(true)} failed. Could not open app.`);
        return;
    }

    /** final syntax checks */
    const errors = await app.checkScriptSyntax();
    const diagnostics: vscode.Diagnostic[] = [];
    errors.forEach((error) => {
        const pos = textEditor.document.positionAt(error.qTextPos);
        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(pos.line, error.qColInLine, pos.line, error.qColInLine + error.qErrLen),
            "vsqlik: error in script"
        );
        diagnostics.push(diagnostic);
    });
    diagnosticsCollection.set(uri, diagnostics);
}
