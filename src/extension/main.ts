import * as vscode from "vscode";
import { container } from "tsyringe";
import { ExtensionContext, SettingsWorkspaceFolder } from "@data/tokens";
import { OpenSettingsCommand } from "@vsqlik/settings/open-settings.command";
import { CreateWorkspaceFolderCommand } from "@vsqlik/workspace/create-workspace-folder.command";

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

    container.register(ExtensionContext, {useValue: context});
    container.register(SettingsWorkspaceFolder, {useValue: "VsQlikSettings.WorkspaceFolders"});

    /**
     * register commands
     */
    vscode.commands.registerCommand('VsQlik.Connection.Create'  , CreateWorkspaceFolderCommand);
    vscode.commands.registerCommand('VsQlik.Connection.Settings', OpenSettingsCommand);

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
