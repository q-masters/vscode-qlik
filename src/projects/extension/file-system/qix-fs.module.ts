import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { VsQlikLoggerGlobal } from "@vsqlik/logger";
import { container, inject, singleton } from "tsyringe";
import * as vscode from "vscode";
import { COMMANDS as ConnectionCommands } from "../connection/api";
import { Routes } from "./data";
import { QixFSProvider } from "./utils/qix-fs.provider";

@singleton()
export class QixFsModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(QixRouter) private router: QixRouter<any>
    ) {}

    public bootstrap(): void {
        this.registerQixFs();
        this.router.addRoutes(Routes);
    }

    public initialize(): void {
        this.registerEvents();

        /**
         * register existing workspace folders (for example close and reopen editor)
         * fs or connect good question
         */
        vscode.workspace.workspaceFolders?.forEach((folder) => {
            if (folder.uri.scheme === 'qix') {
                vscode.commands.executeCommand(ConnectionCommands.CONNECT, folder);
            }
        });
    }

    /**
     * register to filesystem changes
     */
    private registerEvents(): void {

        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            const logger = container.resolve(VsQlikLoggerGlobal);
            event.added.forEach((folder) => {
                if(folder.uri.scheme === 'qix') {
                    logger.info(`added workspace folder ${folder.name}`);
                    vscode.commands.executeCommand(ConnectionCommands.CONNECT, folder);
                }
            });

            event.removed.forEach((folder) => {
                if(folder.uri.scheme === 'qix') {
                    logger.info(`removed workspace folder ${folder.name}`);
                    vscode.commands.executeCommand(ConnectionCommands.DISCONNECT, folder);
                }
            });
        });
    }

    /**
     * register qix file system provider to vscode
     */
    private registerQixFs(): void {
        /** register qixfs provider */
        const qixFs = new QixFSProvider();
        this.extensionContext.subscriptions.push(
            vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    }
}
