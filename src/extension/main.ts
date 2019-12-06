import * as vscode from "vscode";
import { QixFS } from "./utils/qix-fs";
import { EnigmaConnector, EnigmaConfiguration } from "./utils/connector";

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
    const qixFs = new QixFS(enigmaConnector);

    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    context.subscriptions.push(vscode.commands.registerCommand('qixfs.workspaceInit', () => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('qix:/'), name: 'qix://127.0.0.1:9076' });
    }));
}

export function deactivate() {}
