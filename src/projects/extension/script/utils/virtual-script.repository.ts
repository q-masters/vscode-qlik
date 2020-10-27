import { singleton } from "tsyringe";
import * as vscode from "vscode";

@singleton()
export class VirtualScriptRepository {

    private files: Map<string, string> = new Map();

    /**
     * provide content for the document
     */
    public provideTextDocumentContent(uri: vscode.Uri): string {
        const path = uri.toString(true);
        if (this.files.has(uri.toString(true))) {
            return this.files.get(path) as string;
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * create new virtual document and register to cache
     */
    public async createDocument(uri: vscode.Uri, content: string): Promise<vscode.TextDocument> {
        this.files.set(uri.toString(true), content);
        return vscode.workspace.openTextDocument(uri);
    }

    public updateDocument(uri: vscode.Uri, content: string): void {
        const path = uri.toString(true);

        if (!this.files.has(path)) {
            return;
        }

        const source = this.files.get(path) as string;
        if (source !== content) {
            this.files.set(path, content);
        }
    }

    public removeDocument(uri: vscode.Uri): void {
        /** @todo implement */
    }
}
