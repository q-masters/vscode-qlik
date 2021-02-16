import { ConnectionStorage, ExtensionContext } from "@data/tokens";
import * as vscode from "vscode";
import { FileStorage, MemoryStorage } from "@core/storage";
import { SettingsOpenCommand } from "@settings";
import { LoggerFactory, VsQlikLogger } from "@vsqlik/logger";
import { container, inject, singleton } from "tsyringe";
import { COMMANDS, VsQlikLoggerConnection } from "./api";
import { AddConnectionCommand, ServerConnectCommand, ServerDisconnectCommand, RemoveConnectionCommand } from "./commands";

@singleton()
export class ConnectionModule {

    private logger: VsQlikLogger;

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext
    ) {}

    /**
     * bootstrap connection module
     *
     */
    public bootstrap(): void {
        this.registerCommands();
        this.createConnectionStorage();
        this.registerLogger();
    }

    /**
     * initialize
     *
     */
    public initialize(): void {
        this.logger = container.resolve(VsQlikLoggerConnection);
        /**
         * register existing workspace folders (for example close and reopen editor)
         * fs or connect good question
         *
         */
        vscode.workspace.workspaceFolders?.forEach((folder) => {
            if (folder.uri.scheme === 'qix') {
                this.logger.info(`found existing qix workspace folder ${folder.name}`);
                vscode.commands.executeCommand(COMMANDS.CONNECT, folder);
            }
        });
        this.registerOnWorkspaceChanges();
    }

    /**
     *
     *
     */
    private registerLogger() {
        container.register(VsQlikLoggerConnection, { useFactory: LoggerFactory(`VsQlik Connection`) });
    }

    /**
     * register commands for vscode
     *
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
     *
     */
    private createConnectionStorage(): void {
        const settings: any = vscode.workspace.getConfiguration().get('VsQlik.Developer');
        const storage = settings.cacheSession
            ? new FileStorage(this.extensionContext.globalStoragePath, "auth.json")
            : new MemoryStorage();

        /** register connection storage */
        container.register(ConnectionStorage, {useValue: storage});
    }

    /**
     * register workspace folder events to get notified about our active connections
     *
     */
    private registerOnWorkspaceChanges() {

        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            event.added.forEach((folder) => {
                if(folder.uri.scheme === 'qix') {
                    /**
                     * if we handle an empty workspace and added 1 folder (qix) the extension host
                     * will restart soon and then find a qix fs and try to connect to it.
                     *
                     * So we ignore this if we have only 1 workspace folder to avoid 1 connection
                     * which is not required.
                     */
                    this.logger.info(`add qix workspace folder ${folder.name}`);
                    const qixWorkspaceFolders = vscode.workspace.workspaceFolders?.filter((folder) => folder.uri.scheme === 'qix') ?? [];
                    if (qixWorkspaceFolders.length > 1) {
                        vscode.commands.executeCommand(COMMANDS.CONNECT, folder);
                    }
                }
            });

            event.removed.forEach((folder) => {
                if(folder.uri.scheme === 'qix') {
                    this.logger.info(`remove qix workspace folder ${folder.name}`);
                    vscode.commands.executeCommand(COMMANDS.DISCONNECT, folder);
                }
            });
        });
    }
}
