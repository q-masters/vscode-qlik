import * as vscode from "vscode";
import { takeUntil } from "rxjs/operators";
import { Subscription } from "rxjs";
import { inject, singleton } from "tsyringe";
import { QixFSProvider } from "@vsqlik/fs/utils/qix-fs.provider";
import { VirtualScriptRepository } from "./virtual-script.repository";
import { Application } from "projects/extension/connection/utils/application";
import { ConnectionProvider } from "@core/public.api";
import { EntryType } from "@vsqlik/fs/data";
import { ScriptCommands } from "../data/commands";

interface ObservedDocument {
    app: Application;
    subscription: Subscription;
    touched: boolean;
    diffDoc?: vscode.TextDocument;
    outOfSync: boolean;
    isDiffer: boolean;
}

@singleton()
export class ScriptGuard {

    /**
     * map script meta da to current opened document
     */
    private observedDocuments: WeakMap<vscode.TextDocument, ObservedDocument> = new WeakMap();

    public constructor(
        @inject(QixFSProvider) private qixFSProvider: QixFSProvider,
        @inject(VirtualScriptRepository) private virtualScriptRepository: VirtualScriptRepository,
        @inject(ConnectionProvider) private connectionProvider: ConnectionProvider
    ) { }

    public init(): void {
        /** open the app only for save */
        this.registerEvents();
    }

    private observeDocument(doc: vscode.TextDocument, app: Application): ObservedDocument {

        if (!this.observedDocuments.has(doc)) {
            const subscription = app.onChanged()
                .pipe(takeUntil(app.onClose()))
                .subscribe(() => this.onAppChanged(doc));

            this.observedDocuments.set(doc, {
                app,
                subscription: subscription,
                touched: false,
                outOfSync: false,
                isDiffer: false
            });
        }

        return this.observedDocuments.get(doc) as ObservedDocument;
    }

    /**
     * register for vscode workspace events on close and change text document
     */
    private registerEvents() {
        vscode.workspace.onDidOpenTextDocument((event)   => this.onOpenDocument(event));
        vscode.workspace.onDidCloseTextDocument((event)  => this.onCloseDocument(event));
        vscode.workspace.onDidChangeTextDocument((event) => this.onChangeDocument(event));
        vscode.workspace.onWillSaveTextDocument((event)  => this.onWillSaveDocument(event));
        vscode.workspace.onDidSaveTextDocument((event)   => this.onSaveDocument(event));
    }

    /**
     * update cached script but do not write
     * and trigger vscode to reload the document content
     */
    private updateObservedDocument(doc: vscode.TextDocument, content: string) {
        const docData = this.observedDocuments.get(doc);
        if (docData && !docData.touched) {
            docData.app.updateScript(content, false);
            this.qixFSProvider.reloadFile(doc.uri);
        }
    }

    private async showDiff(observed: ObservedDocument, doc: vscode.TextDocument, remoteScript: string) {

        const remoteUri = doc.uri.with({ path: `/remote${doc.uri.path}` });
        if (!observed.diffDoc) {
            const diffDoc   = await this.virtualScriptRepository.createDocument(remoteUri, remoteScript);
            observed.diffDoc = diffDoc;
        }

        observed.isDiffer = true;

        const name = `${observed.app.serverName}/${observed.app.appName}/main.qvs`;
        await vscode.commands.executeCommand(
            'vscode.diff', doc.uri, observed.diffDoc.uri, `local:${name}  \u2194 remote:${name}`, {preview: false});
    }

    /**
     * SECTION: EVENT HANDLER
     */

    /**
     * app has triggered a change check the script from origin
     */
    private async onAppChanged(doc: vscode.TextDocument) {

        const docData      = this.observedDocuments.get(doc) as ObservedDocument;
        const app          = docData.app;
        const remoteScript = await app.getScript(true);
        const sourceScript = await app.getScript();

        if (remoteScript !== sourceScript) {
            if (!docData.touched) {
                this.updateObservedDocument(doc, remoteScript);
                return;
            }

            this.showDiff(docData, doc, remoteScript);
        }

        if (docData.diffDoc) {
            this.virtualScriptRepository.updateDocument(docData.diffDoc.uri, remoteScript);
            this.qixFSProvider.reloadFile(docData.diffDoc.uri);
        }
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

        const app         = await connection.getApplication(appEntry.id) as Application;
        const observedDoc = this.observeDocument(doc, app);

        vscode.commands.executeCommand(ScriptCommands.CHECK_SYNTAX, doc.uri);

        const remoteScript    = await app.getScript(true);
        const lastSavedScript = await app.getScript();

        if (lastSavedScript && remoteScript !== lastSavedScript) {
            this.showDiff(observedDoc, doc, remoteScript);

            /**
             * @todo better name this is not really touched but conflict is not solved
             * since the last working copy and the server version differs
             */
            observedDoc.touched = true;
        }
    }

    /**
     * document has been changed, set touched if it is dirty
     */
    private onChangeDocument(event: vscode.TextDocumentChangeEvent): void {
        const observedDoc = this.observedDocuments.get(event.document);
        if (observedDoc && !observedDoc.touched) {
            observedDoc.touched = event.document.isDirty;
        }
    }

    /**
     * document get closed
     */
    private onCloseDocument(doc: vscode.TextDocument) {

        if (this.observedDocuments.has(doc)) {
            const docData = this.observedDocuments.get(doc) as ObservedDocument;
            docData.subscription.unsubscribe();
            docData.app.releaseScript();

            if (docData.diffDoc) {
                this.virtualScriptRepository.removeDocument(docData.diffDoc.uri);
                delete docData.diffDoc;
            }
            this.observedDocuments.delete(doc);
        }
    }

    /**
     * before the script is saved check we differs from remote app this could happen
     * if we edit the script in vscode save and then go to browser and edit there and save.
     *
     * at this point we get an diff, we just to decide to do nothing and rewrite the script on the server
     * at this point the app sessions are out of sync and our script is saved but if we reload the server
     * we see the old script again (even after reload)
     */
    private async onWillSaveDocument(event: vscode.TextDocumentWillSaveEvent) {
        const observedDoc = this.observedDocuments.get(event.document);

        if (observedDoc) {
            observedDoc.outOfSync = observedDoc.isDiffer && await observedDoc.app.getScript() === event.document.getText();
        }
    }

    /**
     * after document get saved, just ensure if we run out of sync, synchronize app scripts
     */
    private onSaveDocument(document: vscode.TextDocument) {
        const observedDoc = this.observedDocuments.get(document);

        if (observedDoc && observedDoc.outOfSync) {
            vscode.commands.executeCommand(ScriptCommands.SYNCHRONIZE, document.uri, document.getText());
            observedDoc.outOfSync = false;
            observedDoc.isDiffer  = false;
        }
    }
}
