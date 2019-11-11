import * as vscode from "vscode";
import { QixFS } from "./utils/fs";
import { EnigmaConnector, EnigmaConfiguration, RestConnector } from "./utils/connector";

export async function activate(context: vscode.ExtensionContext) {

    /**
     * add data source / connector
     */
    const enigmaConfiguration: EnigmaConfiguration =  {
        domain: "127.0.0.1",
        port: 9076,
        secure: false
    };

    const enigmaConnector = new EnigmaConnector(enigmaConfiguration);
    const restConnector   = new RestConnector("http://dev/null", "test", "test");

    const qixFs = new QixFS();
    qixFs.registerRoot(vscode.Uri.parse("qix:/docker"),  enigmaConnector);
    qixFs.registerRoot(vscode.Uri.parse("qix:/mock"), restConnector);

    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    context.subscriptions.push(vscode.commands.registerCommand('qixfs.workspaceInit', _ => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('qix:/'), name: "Local" });
    }));
}

export function deactivate() {}
