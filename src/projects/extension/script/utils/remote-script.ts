import { singleton } from "tsyringe";
import * as vscode from "vscode";

/**
 * remote script provider to serve
 * scripts which are come from remote side
 */
@singleton()
export class RemoteScriptProvider implements vscode.TextDocumentContentProvider {

    private fileScheme = `qix.remote.script`;

    private files: Map<string, string>;

    private changeEmitter: vscode.EventEmitter<vscode.Uri>;

    /**
     * get scheme for file
     *
     * @readonly
     */
    public get scheme(): string {
        return this.fileScheme;
    }

    public onDidChange: vscode.Event<vscode.Uri>;

    public constructor() {
        this.files = new Map();
        this.changeEmitter = new vscode.EventEmitter();
        this.onDidChange   = this.changeEmitter.event;
    }

    /**
     * provide content for the document
     */
    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.files.get(uri.toString(true)) ?? 'we are sorry, remote script not found!';
    }

    /**
     * create new virtual document and register to cache
     */
    public async createDocument(name: string, content: string): Promise<vscode.TextDocument> {
        const uri = vscode.Uri.parse(`${this.scheme}:${name}.qvs`);
        this.files.set(uri.toString(true), content);
        return vscode.workspace.openTextDocument(uri);
    }

    public updateDocument(name: string, content: string): void {
        const uri  = vscode.Uri.parse(`${this.scheme}:${name}.qvs`);
        const path = uri.toString(true);

        if (!this.files.has(path)) {
            return;
        }

        const source = this.files.get(path) as string;

        if (source !== content) {
            this.files.set(path, content);
            this.changeEmitter.fire(uri);
        }
    }
}
