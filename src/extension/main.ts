import "./enigma";

import * as vscode from "vscode";
import { ConnectionCreateCommand, ConnectionSettingsCommands, ConnectionCommands } from "./connection";
import { QixFSProvider, WorkspaceFolderManager, QixRouter, Route} from "@qixfs/utils";
import { SessionCache, ExtensionContext, ConnectionSettings } from "@extension/utils";
import { DocumentsDirectory, AppDirectory, AppScriptDirectory, QlikScriptFile } from "@qixfs-entry";

/**
 * @todo check for guard since this could be [SOMETHING]/scripts and this is wrong
 * since SOMETHING not is an app
 */
export const routes: Route[] = [{
    path: "",
    ctrl: DocumentsDirectory,
}, {
    path: ":app",
    ctrl: AppDirectory,
}, {
    path: ":app/scripts",
    ctrl: AppScriptDirectory,
}, {
    path: ":app/scripts/main.qvs",
    ctrl: QlikScriptFile
}];

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
    QixRouter.addRoutes(routes);

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
