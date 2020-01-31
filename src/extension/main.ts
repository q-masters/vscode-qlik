import * as vscode from "vscode";
import "@lib/enigma";

import { VSQlikConnectionCreateCommand } from "@data/commands";
import { ConnectionSettings, ExtensionContext, ExtensionPath } from "@data/tokens";
import { Routes } from "@data/routes";
import { SettingsModule } from "@lib/settings";
import { QixFsModule } from "@lib/qixfs";
import { SessionCache } from "@utils";

/** todo move to a connection module @lib/connection */
import { ConnectionCreateCommand } from "./libs/settings/src/utils";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    /** add some data to session cache */
    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ExtensionPath, context.extensionPath);
    SessionCache.add(ConnectionSettings, `VSQlik.Connection`);

    /** register connection commands */
    vscode.commands.registerCommand(VSQlikConnectionCreateCommand, ConnectionCreateCommand);

    /** bootstrap modules */
    QixFsModule.bootstrap(context, Routes);
    SettingsModule.bootstrap();
}

export function deactivate() {
}
