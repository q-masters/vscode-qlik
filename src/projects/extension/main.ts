import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";
import { ExtensionContext, SettingsWorkspaceFolder } from "projects/extension/data/tokens";
import { OpenSettingsCommand } from "projects/extension/settings/open-settings.command";

import { QixFSProvider, WorkspaceFolderRegistry } from "projects/extension/workspace/utils";
import { CreateWorkspaceFolderCommand } from "projects/extension/workspace/commands";
import { QixRouter } from "projects/shared/router";

import { Routes } from "./file-system/data/routes";

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
    container.resolve(WorkspaceFolderRegistry).register(vscode.workspace.workspaceFolders || []);

    /** register routes */
    container.resolve(QixRouter).addRoutes(Routes);

    const qixFs  = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));

    /*
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
        WorkspaceFolderManager.addFolder(event.added);
        WorkspaceFolderManager.removeFolder(event.removed);
    });
    */
}

export function deactivate() {
    throw new Error("@todo not implemented yet");
}
