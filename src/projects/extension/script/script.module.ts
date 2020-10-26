import * as vscode from "vscode";
import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";
import { EntryType } from "@vsqlik/fs/data";
import { Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";
import { ConnectionProvider } from "../connection/utils/connection.provider";
import { Application } from "../connection/utils/application";
import { QixFSProvider } from "@vsqlik/fs/utils/qix-fs.provider";
import { DocumentRepository, ReadonlyScriptFileCtrl } from "./utils";

interface ObservedDocument {
    subscription: Subscription;
    app: Application;
}

@singleton()
export class ScriptModule {

    private observedDocuments: WeakMap<vscode.TextDocument, ObservedDocument> = new WeakMap();

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider,
        @inject(QixFSProvider) private qixFSProvider: QixFSProvider,
        @inject(QixRouter) private router: QixRouter<any>,
        @inject(DocumentRepository) private scriptRepository: DocumentRepository
    ) {}

    public bootstrap(): void {
        this.registerRoutes();
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

        if (!appEntry || fileEntry?.type !== EntryType.SCRIPT) {
            return;
        }

        const app = await connection?.getApplication(appEntry.id);
        await app?.lockScript();

        if (!app) {
            return;
        }

        const subscription = app.onChanged()
            .pipe(takeUntil(app.onClose()))
            .subscribe(() => this.onAppChanged(doc, app));

        /** @todo improve */
        this.observedDocuments.set(doc, { app, subscription: subscription });

        vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri);
    }

    /**
     * app has triggered a change check the script from origin
     */
    private async onAppChanged(doc: vscode.TextDocument, app: Application) {

        const remoteScript = await app.getScript(true);
        const remoteUri    = doc.uri.with({ path: `/remote${doc.uri.path}` });

        if (await this.remoteScriptIsDifferent(doc)) {
            this.openDiff(doc, app);
            return;
        }

        this.scriptRepository.updateDocument(remoteUri, remoteScript);
        this.qixFSProvider.reloadFile(remoteUri);
    }

    /**
     * open a diff between 2 scripts (local <-> server)
     */
    private async openDiff(doc: vscode.TextDocument, app: Application) {

        const remoteScript = await app.document.then((doc) => doc.getScript());
        const remoteUri = doc.uri.with({ path: `/remote${doc.uri.path}` });

        const name = `${app.serverName}/${app.appName}/main.qvs`;
        await this.scriptRepository.createDocument(remoteUri, remoteScript);
        await vscode.commands.executeCommand('vscode.diff', doc.uri, remoteUri, `local:${name}  \u2194 remote:${name}`, {preview: false});
    }

    /**
     *
     */
    private async onCloseDocument(doc: vscode.TextDocument) {
        const data = this.observedDocuments.get(doc);
        if (data) {
            data.subscription.unsubscribe();
            data.app.unlockScript();
            this.observedDocuments.delete(doc);
        }
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
        vscode.workspace.onDidCloseTextDocument((document)  => this.onCloseDocument(document));
        vscode.workspace.onDidOpenTextDocument((document)   => this.onOpenDocument(document));
    }

    /**
     * register script specific routes
     */
    private registerRoutes(): void {
        this.router.addRoutes([
            {
                path: 'remote/:context/:app/script/main.qvs',
                ctrl: ReadonlyScriptFileCtrl
            }
        ]);
    }

    /**
     * check remote script is diffrent from local source
     */
    private async remoteScriptIsDifferent(doc: vscode.TextDocument): Promise<boolean> {

        const connection = await this.connectionProvider.resolve(doc.uri);
        const fileEntry  = connection?.fileSystem.read(doc.uri.toString(true));
        const appEntry   = connection?.fileSystem.parent(doc.uri, EntryType.APPLICATION);

        if (!appEntry || fileEntry?.type !== EntryType.SCRIPT) {
            return false;
        }

        const app = await connection?.getApplication(appEntry.id);

        if (!app) {
            return false;
        }

        const remoteScript = await app.getScript(true);
        const localScript  = await app.getScript();

        return remoteScript !== localScript;
    }
}
