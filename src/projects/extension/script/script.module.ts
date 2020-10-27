import * as vscode from "vscode";
import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";
import { EntryType } from "@vsqlik/fs/data";

import { ConnectionProvider } from "../connection/utils/connection.provider";
import { Application } from "../connection/utils/application";

import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";
import { routes } from "./data/routes";
import { ScriptGuard } from "./utils/script.guard";

@singleton()
export class ScriptModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider,
        @inject(QixRouter) private router: QixRouter<any>,
        @inject(ScriptGuard) private scriptGuard: ScriptGuard
    ) { }

    /**
     * bootstrap script module
     */
    public bootstrap(): void {
        this.router.addRoutes(routes);

        this.registerCommands();
        this.registerEvents();
    }

    /**
     * a new textdocument has been opened
     * check we handle a script file and if we do connect to appChange stream
     */
    private async onOpenDocument(doc: vscode.TextDocument) {

        if (doc.uri.scheme !== "qix") {
            return;
        }

        /** resolve connection and entry type */
        const connection = await this.connectionProvider.resolve(doc.uri);
        const fileEntry  = connection?.fileSystem.read(doc.uri.toString(true));
        const appEntry   = connection?.fileSystem.parent(doc.uri, EntryType.APPLICATION);

        if (!connection || !appEntry || fileEntry?.type !== EntryType.SCRIPT) {
            return;
        }

        const app = await connection.getApplication(appEntry.id) as Application;
        this.scriptGuard.add(doc, app);

        vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri);
    }

    /**
     * register commands for vscode
     */
    private registerCommands(): void {
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.CheckSyntax', CheckScriptSyntax));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.LoadData', ScriptLoadDataCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.ResolveActive', ScriptResolveActiveCommand));
    }

    /**
     * register connection storage where all sessions are saved to
     */
    private registerEvents(): void {
        vscode.workspace.onDidOpenTextDocument((document)   => this.onOpenDocument(document));
    }
}
