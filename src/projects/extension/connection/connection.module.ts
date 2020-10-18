import { ConnectionStorage, ExtensionContext } from "@data/tokens";
import * as vscode from "vscode";
import { FileStorage, MemoryStorage } from "@core/storage";
import { SettingsOpenCommand } from "@settings";
import { LoggerFactory } from "@vsqlik/logger";
import { container, inject, singleton } from "tsyringe";
import { COMMANDS, VsQlikLoggerConnection } from "./api";
import { AddConnectionCommand, ServerConnectCommand, ServerDisconnectCommand, RemoveConnectionCommand } from "./commands";

@singleton()
export class ConnectionModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext
    ) {}

    /**
     * bootstrap connection module
     */
    public bootstrap(): void {
        this.registerCommands();
        this.createConnectionStorage();
        this.registerLogger();
    }

    private registerLogger() {
        container.register(VsQlikLoggerConnection, { useFactory: LoggerFactory(`VsQlik Connection`) });
    }

    /**
     * register commands for vscode
     */
    private registerCommands(): void {
        vscode.commands.registerCommand('VsQlik.Connection.Create',   AddConnectionCommand);
        vscode.commands.registerCommand('VsQlik.Connection.Settings', SettingsOpenCommand);

        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(COMMANDS.CONNECT, ServerConnectCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(COMMANDS.DISCONNECT, ServerDisconnectCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Connection.Remove', RemoveConnectionCommand));
    }

    /**
     * register connection storage where all sessions are saved to
     */
    private createConnectionStorage(): void {
        const settings: any = vscode.workspace.getConfiguration().get('VsQlik.Developer');
        const storage = settings.cacheSession
            ? new FileStorage(this.extensionContext.globalStoragePath, "auth.json")
            : new MemoryStorage();

        /** register connection storage */
        container.register(ConnectionStorage, {useValue: storage});
    }
}
