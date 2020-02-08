import * as vscode from "vscode";
import "@lib/enigma";
import { Routes } from "@data/routes";
import { ExtensionContext, ExtensionPath } from "@data/tokens";
import { QixFsModule } from "@lib/qixfs";
import { SessionCache } from "@utils";

/** todo move to a connection module @lib/connection */
import { ConnectionModule } from "@lib/connection";

/**
 * bootstrap extension
 */
export async function activate(context: vscode.ExtensionContext) {

    /** add some data to session cache */
    SessionCache.add(ExtensionContext, context);
    SessionCache.add(ExtensionPath, context.extensionPath);

    /** bootstrap modules */
    QixFsModule.bootstrap(context, Routes);
    ConnectionModule.bootstrap();
}

export function deactivate() {
}
