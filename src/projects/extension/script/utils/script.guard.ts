import * as vscode from "vscode";
import { takeUntil } from "rxjs/operators";
import { Subscription } from "rxjs";
import { inject, singleton } from "tsyringe";
import { QixFSProvider } from "@vsqlik/fs/utils/qix-fs.provider";
import { VirtualScriptRepository } from "./virtual-script.repository";
import { Application } from "projects/extension/connection/utils/application";

interface ObservedDocument {
    app: Application;
    subscription: Subscription;
    touched: boolean;
    diffDoc?: vscode.TextDocument;
}

@singleton()
export class ScriptGuard {

    /**
     * map script meta da to current opened document
     */
    private observedDocuments: WeakMap<vscode.TextDocument, ObservedDocument> = new WeakMap();

    /**
     * map to bind diff documents to source documents
     */
    private diffDocs: WeakMap<vscode.TextDocument, vscode.TextDocument> = new WeakMap();

    public constructor(
        @inject(QixFSProvider) private qixFSProvider: QixFSProvider,
        @inject(VirtualScriptRepository) private virtualScriptRepository: VirtualScriptRepository
    ) {
        this.registerEvents();
    }

    public add(doc: vscode.TextDocument, app: Application): void {

        if (!this.observedDocuments.has(doc)) {
            const subscription = app.onChanged()
                .pipe(takeUntil(app.onClose()))
                .subscribe(() => this.onAppChanged(doc));

            this.observedDocuments.set(doc, {
                app,
                subscription: subscription,
                touched: false
            });
        }
    }

    public isGuarded(doc: vscode.TextDocument): boolean {
        return this.observedDocuments.has(doc);
    }

    /**
     * app has triggered a change check the script from origin
     */
    private async onAppChanged(doc: vscode.TextDocument) {

        const docData      = this.observedDocuments.get(doc) as ObservedDocument;
        const app          = docData.app;
        const remoteScript = await app.getScript(true);
        const sourceScript = await app.getScript();
        const isDiff = remoteScript !== sourceScript;

        if (isDiff) {
            if (!docData.touched) {
                this.updateObservedDocument(doc, remoteScript);
                return;
            }

            if (!docData.diffDoc) {
                const remoteUri = doc.uri.with({ path: `/remote${doc.uri.path}` });
                const name      = `${app.serverName}/${app.appName}/main.qvs`;
                const diffDoc   = await this.virtualScriptRepository.createDocument(remoteUri, remoteScript);

                docData.diffDoc = diffDoc;
                this.diffDocs.set(diffDoc, doc);

                await vscode.commands.executeCommand('vscode.diff', doc.uri, diffDoc.uri, `local:${name}  \u2194 remote:${name}`, {preview: false});
            } else {
                this.virtualScriptRepository.updateDocument(docData.diffDoc.uri, remoteScript);
                this.qixFSProvider.reloadFile(docData.diffDoc.uri);
            }
        }
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

    /**
     * register for vscode workspace events on close and change text document
     */
    private registerEvents() {
        vscode.workspace.onDidCloseTextDocument((event) => this.onCloseDocument(event));
        vscode.workspace.onDidChangeTextDocument((event) => this.onChangeDocument(event));
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

        if(this.diffDocs.has(doc)) {
            this.removeDiffDocument(doc);
        }

        if (this.observedDocuments.has(doc)) {
            this.removeObservedDocument(doc);
        }
    }

    /**
     * diff editor gets closed and remove the diff document
     * that not includes the source document is closed
     */
    private removeDiffDocument(doc: vscode.TextDocument) {
        const diffSource = this.diffDocs.get(doc) as vscode.TextDocument;
        delete this.observedDocuments.get(diffSource)?.diffDoc;

        this.virtualScriptRepository.removeDocument(doc.uri);
        this.diffDocs.delete(doc);
    }

    /**
     * if we remove an observed document
     */
    private removeObservedDocument(doc: vscode.TextDocument): void {
        const data = this.observedDocuments.get(doc);

        if (data && !data.diffDoc) {
            data.subscription.unsubscribe();
            data.app.releaseScript();

            this.observedDocuments.delete(doc);
        }
    }
}
