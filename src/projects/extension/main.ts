import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";
import { ExtensionContext, SettingsWorkspaceFolder } from "projects/extension/data/tokens";
import { QixRouter } from "@shared/router";

import { OpenSettingsCommand } from "@vsqlik/settings/open-settings.command";
import { CreateWorkspaceFolderCommand } from "@vsqlik/workspace/commands";
import { QixFSProvider, WorkspaceFolderRegistry } from "@vsqlik/workspace/utils";
import { Routes } from "@vsqlik/fs/data";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    /** register global environment variables */
    container.register(ExtensionContext, {useValue: context});
    container.register(SettingsWorkspaceFolder, {useValue: "VsQlikSettings.WorkspaceFolders"});

    /** register commands */
    vscode.commands.registerCommand('VsQlik.Connection.Create'  , CreateWorkspaceFolderCommand);
    vscode.commands.registerCommand('VsQlik.Connection.Settings', OpenSettingsCommand);

    /** register workspace folders */
    container.resolve(WorkspaceFolderRegistry).register(vscode.workspace.workspaceFolders || []);

    /** register routes */
    container.resolve(QixRouter).addRoutes(Routes);

    const qixFs = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
}

export function deactivate() {
    throw new Error("@todo not implemented yet");
}
