import * as vscode from "vscode";
import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";
import { EntryType } from "@vsqlik/fs/data";
import { Subscription } from "rxjs";

import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";
import { ConnectionProvider } from "../connection/utils/connection.provider";
import { Application } from "../connection/utils/application";
import { QixFSProvider } from "@vsqlik/fs/utils/qix-fs.provider";
import { ReadonlyScriptFileCtrl } from "./utils/readonly-script.file";
import { ScriptRepository } from "./utils/script.repository";

@singleton()
export class ScriptModule {

    private observedDocuments: WeakMap<vscode.TextDocument, Subscription> = new WeakMap();

    private isDiff = false;

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider,
        @inject(QixFSProvider) private qixFSProvider: QixFSProvider,
        @inject(QixRouter) private router: QixRouter<any>,
        @inject(ScriptRepository) private scriptRepository: ScriptRepository
    ) {}

    public bootstrap(): void {
        this.registerRoutes();
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
        vscode.workspace.onDidCloseTextDocument((document) => this.onCloseDocument(document));
    }

    /**
     * register script specific routes
     */
    private registerRoutes(): void {
        this.router.addRoutes([
            {
                path: 'remote/:app_id/scripts/main.qvs',
                ctrl: ReadonlyScriptFileCtrl
            }
        ]);
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
        const subscription = app?.onChanged()
            .subscribe(() => this.onAppChanged(doc, app));

        /** @todo improve */
        this.observedDocuments.set(doc, subscription as Subscription);

        vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri);
    }

    /**
     * app has triggered a change check the script from origin
     */
    private async onAppChanged(document: vscode.TextDocument, app: Application) {
        const origin = await app.document.then((doc) => doc.getScript());
        const source = document.getText();

        if (origin !== source && !this.isDiff) {
            const doc = await this.scriptRepository.createDocument(origin);
            vscode.commands.executeCommand('vscode.diff', document.uri, doc.uri);
            this.isDiff = true;
            return;
        }

        const uri  = vscode.Uri.parse(`qix:/remote/abc/scripts/main.qvs`);
        this.scriptRepository.updateDocument(origin);
        this.qixFSProvider.reloadFile(uri);
    }

    /**
     *
     */
    private async onCloseDocument(doc: vscode.TextDocument) {
        this.observedDocuments.get(doc)?.unsubscribe();
        this.observedDocuments.delete(doc);
    }
}
