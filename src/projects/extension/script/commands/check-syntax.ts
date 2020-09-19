import { ConnectionProvider } from "@core/public.api";
import { QixApplicationProvider } from "@core/qix/utils/application.provider";
import { EntryType } from "@vsqlik/fs/data";
import { EOL } from "os";
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

    if (!connection || !appEntry) {
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
    if (errors.length) {
        const script = await app.getScript();
        const diagnostics = errors.map<vscode.Diagnostic>((error) => {
            const line = script.substring(0, error.qTextPos).split(EOL).length - 1;
            return new vscode.Diagnostic(
                new vscode.Range(line, error.qColInLine, line, error.qColInLine + error.qErrLen),
                "vsqlik: error in script"
            );
        });
        diagnosticsCollection.set(uri, diagnostics);
    }
}
