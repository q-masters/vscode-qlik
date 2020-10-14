import "reflect-metadata";
import * as vscode from "vscode";
import { container } from "tsyringe";
import { QixRouter } from "@shared/router";

import { SettingsOpenCommand, SettingsUpdateCommand } from "@settings";
import { Routes } from "@vsqlik/fs/data";
import { VsQlikLoggerResolver } from "@vsqlik/logger";
import { ExtensionContext, VsQlikServerSettings, VsQlikDevSettings, ConnectionStorage, QlikOutputChannel } from "./data/tokens";
import { FileStorage, MemoryStorage } from "@core/storage";
import { AddConnectionCommand, RemoveConnectionCommand } from "./connection";
import { QixFSProvider } from "./file-system/utils/qix-fs.provider";
import { ServerConnectCommand } from "./connection/commands/connect";
import { ServerDisconnectCommand } from "./connection/commands/disconnect";
import { CheckScriptSyntax } from "./script/commands/check-syntax";
import { ScriptLoadDataCommand } from "./script";
import { ScriptResolveActiveCommand } from "./script/commands/active-script";

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

    registerCommands(context);
    registerEvents();
    registerWorkspacefolderEvents();

    /** register existing workspace folders (for example close and reopen editor) */
    vscode.workspace.workspaceFolders?.forEach((folder) => {
        if (folder.uri.scheme === 'qix') {
            vscode.commands.executeCommand('VsQlik.Connection.Connect', folder);
        }
    });

    /** get global logger */
    container.resolve(VsQlikLoggerResolver).resolve().info(`extension activated`);
}

/**
 * register custom commands
 */
function registerCommands(context: vscode.ExtensionContext) {
    /** register commands */
    vscode.commands.registerCommand('VsQlik.Connection.Create',   AddConnectionCommand);
    vscode.commands.registerCommand('VsQlik.Connection.Settings', SettingsOpenCommand);

    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Connection.Connect', ServerConnectCommand));
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Connection.Disconnect', ServerDisconnectCommand));
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Connection.Remove', RemoveConnectionCommand));
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Settings.Update', SettingsUpdateCommand));

    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.CheckSyntax', CheckScriptSyntax));
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.LoadData', ScriptLoadDataCommand));
    context.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.ResolveActive', ScriptResolveActiveCommand));
}

function registerEvents() {
    vscode.workspace.onDidOpenTextDocument((doc: vscode.TextDocument) => {
        doc.fileName.match(/\.qvs$/)
            ? vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri)
            : void 0;
    });
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

/**
 * listen to workspace folder events (added / removed)
 */
function registerWorkspacefolderEvents() {

    vscode.workspace.onDidChangeWorkspaceFolders((event) => {

        const logger = container.resolve(VsQlikLoggerResolver).resolve();
        logger.info(JSON.stringify(event));

        event.added.forEach((folder) => {
            if(folder.uri.scheme === 'qix') {
                vscode.commands.executeCommand('VsQlik.Connection.Connect', folder);
            }
        });

        event.removed.forEach((folder) => {
            if(folder.uri.scheme === 'qix') {
                vscode.commands.executeCommand('VsQlik.Connection.Disconnect', folder);
            }
        });
    });
}

export function deactivate(): void {
    /** @todo implement */
    const logger = container.resolve(VsQlikLoggerResolver).resolve();
    logger.info(`deactivate extension`);
}
