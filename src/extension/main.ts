import * as vscode from "vscode";
import { QixFs, QixFsAction } from "./qix";
import { Connection, ConnectionAction } from "./connection";
import { SessionCache, ExtensionContext, COMMAND } from "./shared";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    SessionCache.add(ExtensionContext, context);

    /** create new workspace for qixfs */
    vscode.commands.registerCommand(COMMAND.QIX_FS_INIT, () => QixFs.run(QixFsAction.INIT));

    /** run connection webview */
    vscode.commands.registerCommand(COMMAND.CONNECTION_CREATE, () => Connection.run(ConnectionAction.CREATE));
}

export function deactivate() {}
