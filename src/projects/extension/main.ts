import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";
import { QixRouter } from "@shared/router";

import { OpenSettingsCommand } from "@vsqlik/settings/open-settings.command";
import { CreateWorkspaceFolderCommand } from "@vsqlik/workspace/commands";
import { QixFSProvider, WorkspaceFolderRegistry } from "@vsqlik/workspace/utils";
import { Routes } from "@vsqlik/fs/data";
import { ExtensionContext, VsQlikServerSettings, VsQlikDevSettings, ConnectionStorage } from "./data/tokens";
import { FileStorage, MemoryStorage } from "@core/storage";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    /** register global environment variables */
    container.register(ExtensionContext, {useValue: context});
    container.register(VsQlikServerSettings, {useValue: "VsQlik.Servers"});
    container.register(VsQlikDevSettings, {
        useFactory: () => vscode.workspace.getConfiguration().get('VsQlik.Developer')
    });

    /** register connection storage */
    container.register(ConnectionStorage, {
        useFactory: () => {
            const settings: any = vscode.workspace.getConfiguration().get('VsQlik.Developer');
            return settings.cacheSession
                ? new FileStorage(context.globalStoragePath, "auth.json")
                : new MemoryStorage();
        }
    });

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
