import "./enigma";

import * as vscode from "vscode";
import { ConnectionCommands } from "./connection";
import { QixFSProvider, WorkspaceFolderManager, QixRouter } from "@qixfs/utils";
import { Routes } from "@qixfs/entry";
import { SessionCache, ExtensionContext, ConnectionSettings, ExtensionPath } from "@extension/utils";
import { VSQlikConnectionCreateCommand } from "@commands";
import { ConnectionCreateCommand } from "@settings/utils";
import { SettingsModule } from "./settings/settings.module";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
    QixRouter.addRoutes(Routes);

    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ExtensionPath, context.extensionPath);
    SessionCache.add(ConnectionSettings, `VSQlik.Connection`);

    /** register connection commands */
    vscode.commands.registerCommand(VSQlikConnectionCreateCommand, ConnectionCreateCommand);

    SettingsModule.bootstrap();

    /** register fs */
    const qixFs  = new QixFSProvider();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
}

export function deactivate() {
}
