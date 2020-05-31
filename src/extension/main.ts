import * as vscode from "vscode";
import { OpenSettingsCommand } from "@vsqlik/settings/commands";
import "reflect-metadata";

/*
import { ExtensionContext, ExtensionPath } from "backup/data/tokens";
import { SessionCache } from "backup/utils";
import { OpenSettingsCommand } from "backup/libs/settings/commands";
import { CreateWorkspaceFolderCommand } from "backup/libs/workspace/commands";
*/

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    /** add some data to session cache
    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ExtensionPath, context.extensionPath);
    */

    /**
     * register commands
     *
    vscode.commands.registerCommand('VSQlik.Connection.Create'  , CreateWorkspaceFolderCommand);
    */
    vscode.commands.registerCommand('VSQlik.Connection.Settings', OpenSettingsCommand);

    /** register workspace folders */
    /*
        WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
        QixRouter.addRoutes(routes);

        const qixFs  = new QixFSProvider();
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));

        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            WorkspaceFolderManager.addFolder(event.added);
            WorkspaceFolderManager.removeFolder(event.removed);
        });
    */
}

export function deactivate() {
    throw new Error("@todo not implemented yet");
}
