import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";
import { QixRouter } from "@shared/router";

import { OpenSettingsCommand } from "@vsqlik/settings/open-settings.command";
import { Routes } from "@vsqlik/fs/data";
import { ExtensionContext, VsQlikServerSettings, VsQlikDevSettings, ConnectionStorage } from "./data/tokens";
import { FileStorage, MemoryStorage } from "@core/storage";
import { AddConnectionCommand, RemoveConnectionCommand } from "./connection";
import { QixFSProvider } from "./file-system/utils/qix-fs.provider";

/**
 * bootstrap extension
 */
export function activate(context: vscode.ExtensionContext) {

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

    /** register routes */
    container.resolve(QixRouter).addRoutes(Routes);

    /** register qixfs provider */
    const qixFs = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));

    /** register commands */
    vscode.commands.registerCommand('VsQlik.Connection.Create'  , AddConnectionCommand);
    vscode.commands.registerCommand('VsQlik.Connection.Settings', OpenSettingsCommand);

    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Connection.Remove', RemoveConnectionCommand));

    /** register existing workspace folders (for example close and reopen editor) */
    vscode.workspace.workspaceFolders?.forEach((folder) => {
        if (folder.uri.scheme === 'qix') {
            vscode.commands.executeCommand('VsQlik.Connection.Create', folder);
        }
    });
}

export function deactivate() {
    throw new Error("@todo not implemented yet");
}
