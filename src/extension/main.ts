import "./enigma";

import * as vscode from "vscode";
import { ConnectionCreateCommand, ConnectionSettingsCommands, ConnectionCommands } from "./connection";
import { QixFSProvider, WorkspaceFolderManager, QixRouter } from "@qixfs/utils";
import { SessionCache, ExtensionContext, ConnectionSettings } from "@extension/utils";
import { Routes } from "@qixfs-entry";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
    QixRouter.addRoutes(Routes);

    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ConnectionSettings, `VSQlik.Connection`);

    /** register connection commands */
    vscode.commands.registerCommand(ConnectionCommands.CREATE,   ConnectionCreateCommand);
    vscode.commands.registerCommand(ConnectionCommands.SETTINGS, ConnectionSettingsCommands);

    /** register fs */
    const qixFs  = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
}

export function deactivate() {
}
