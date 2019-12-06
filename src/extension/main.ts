import * as vscode from "vscode";
import { DocumentsDirectory, QixFS } from "./libs/fs";
import { EnigmaConfiguration, EnigmaProvider } from "./utils";

export async function activate(context: vscode.ExtensionContext) {

    /** add data source / connector */
    const config: EnigmaConfiguration = { domain: "127.0.0.1", port: 9076, secure: false };
    const rootDir = new DocumentsDirectory(new EnigmaProvider(config));

    const qixFs = new QixFS();
    qixFs.root  = rootDir;

    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    context.subscriptions.push(vscode.commands.registerCommand('qixfs.workspaceInit', () => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('qix:/'), name: `qix:/localhost:9076`});
    }));
}

export function deactivate() {}
