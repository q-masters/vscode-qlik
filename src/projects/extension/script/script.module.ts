import { ExtensionContext } from "@data/tokens";
import * as vscode from "vscode";
import { inject, singleton } from "tsyringe";
import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";
import { ConnectionProvider } from "../connection/utils/connection.provider";
import { EntryType } from "@vsqlik/fs/data";
import { takeUntil } from "rxjs/operators";

@singleton()
export class ScriptModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider
    ) {}

    public bootstrap(): void {
        this.registerCommands();
        this.registerEvents();
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

        vscode.workspace.onDidOpenTextDocument((document) => this.onOpenDocument(document));
        vscode.workspace.onDidCloseTextDocument((document) => {
            console.log(`close document`);
            console.log(document);
        });
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

        if (!appEntry || fileEntry?.type !== EntryType.SCRIPT) {
            return;
        }

        /** since we handle a script listen to onchange for app here until app get closed */
        const app = await connection?.getApplication(appEntry.id);
        app?.onChanged()
            .subscribe(() => console.log('app changed'));

        vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri);
    }
}
