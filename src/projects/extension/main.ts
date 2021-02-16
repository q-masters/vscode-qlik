import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";

import { SettingsUpdateCommand } from "@settings";
import { VsQlikLoggerGlobal } from "@vsqlik/logger";
import { ConnectionModule } from "@vsqlik/connection";
import { QixFsModule } from "@vsqlik/qixfs";
import { ScriptModule } from "@vsqlik/script";

import { ExtensionContext, VsQlikServerSettings, VsQlikDevSettings, QlikOutputChannel } from "./data/tokens";
import { AuthorizationModule } from "@auth/authorization.module";

/**
 * bootstrap extension
 */
export function activate(context: vscode.ExtensionContext): void {

    /** register global environment variables */
    container.register(ExtensionContext, {useValue: context});
    container.register(VsQlikServerSettings, {useValue: "VsQlik.Servers"});
    container.register(VsQlikDevSettings, {
        useFactory: () => vscode.workspace.getConfiguration().get('VsQlik.Developer')
    });

    container.register(QlikOutputChannel, { useFactory: outputChannelFactory() });

    /** resolve modules */
    const authorizationModule = container.resolve(AuthorizationModule);
    const connectionModule = container.resolve(ConnectionModule);
    const qixFsModule      = container.resolve(QixFsModule);
    const scriptModule     = container.resolve(ScriptModule);

    /** bootstrap modules */
    authorizationModule.bootstrap();
    connectionModule.bootstrap();
    qixFsModule.bootstrap();
    scriptModule.bootstrap();

    /** initialize modules */
    authorizationModule.initialize();
    connectionModule.initialize();

    registerCommands(context);

    container.resolve(VsQlikLoggerGlobal).info(`extension activated`);
}

/**
 * register custom commands
 */
function registerCommands(context: vscode.ExtensionContext) {
    /** register commands */
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Settings.Update', SettingsUpdateCommand));
}

function outputChannelFactory(): () => vscode.OutputChannel {
    let channel: vscode.OutputChannel;
    return () => {
        if (!channel) {
            channel = vscode.window.createOutputChannel(`Qlik`);
        }
        return channel;
    };
}

export function deactivate(): void {
    /** @todo implement */
    container.resolve(VsQlikLoggerGlobal).info(`deactivate extension`);
}
