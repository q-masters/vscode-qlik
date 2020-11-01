import { ConnectionProvider } from "@core/public.api";
import { EntryType } from "@vsqlik/fs/data";
import { EOL } from "os";
import { container } from "tsyringe";
import * as vscode from "vscode";

const connectionProviver    = container.resolve(ConnectionProvider);
const diagnosticsCollection = vscode.languages.createDiagnosticCollection("vsqlik.script_errors");

/**
 * checks the script syntax for a qlik script
 */
export async function CheckScriptSyntax(uri: vscode.Uri): Promise<void> {

    /** get required data, connection, app and the text editor which contains the script */
    const connection = await connectionProviver.resolve(uri);
    const appEntry   = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

    if (!connection || !appEntry) {
        return;
    }

    /** open the app */
    const app = await connection.getApplication(appEntry.id);

    if (!app) {
        vscode.window.showInformationMessage(`check syntax for file: ${uri.toString(true)} failed. Could not open app.`);
        return;
    }

    /** final syntax checks */
    const document = await app.document;
    const errors   = await document.checkScriptSyntax();

    const diagnostics: vscode.Diagnostic[] = [];

    if (errors.length) {
        const script = await document.getScript();

        errors.forEach((error) => {
            const line = script.substring(0, error.qTextPos).split(EOL).length - 1;
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(line, error.qColInLine, line, error.qColInLine + error.qErrLen),
                "vsqlik: error in script"
            );
            diagnostics.push(diagnostic);
        });
    }
    diagnosticsCollection.set(uri, diagnostics);
}
