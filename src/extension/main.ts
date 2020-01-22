import * as vscode from "vscode";
import { SessionCache, ExtensionContext, ConnectionSettings } from "./utils";
import { QixFSProvider } from "./qix/src/qix-fs.provider";
import { ConnectionCreateCommand, ConnectionSettingsCommands, ConnectionCommands } from "./connection";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ConnectionSettings, `VSQlik.Connections`)

    vscode.commands.registerCommand(ConnectionCommands.CREATE,   ConnectionCreateCommand);
    vscode.commands.registerCommand(ConnectionCommands.SETTINGS, ConnectionSettingsCommands);

    /*
    const workspaceFolders = [
        { uri: vscode.Uri.parse('qix:/locaholhost:9076/somethingCustom'), name: `qix:/localhost:9076`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9077'), name: `qix:/localhost:9077`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9078'), name: `qix:/localhost:9078`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9079'), name: `qix:/localhost:9079`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9080'), name: `qix:/localhost:9080`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9081'), name: `qix:/localhost:9081`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9082'), name: `qix:/localhost:9082`},
        { uri: vscode.Uri.parse('qix:/locaholhost:9083'), name: `qix:/localhost:9083`}
    ];
    vscode.workspace.updateWorkspaceFolders(0, 0, ...workspaceFolders);
    */

    /** register fs */
    const qixFs = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
}

export function deactivate() {
    console.log("direkt nochmal rein hier");
}
