import { singleton } from "tsyringe";
import * as vscode from "vscode";

@singleton()
export class ScriptRepository {

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
    public async createDocument(content: string): Promise<vscode.TextDocument> {
        const uri = vscode.Uri.parse(`qix:/remote/abc/scripts/main.qvs`);
        this.files.set(uri.toString(true), content);
        return vscode.workspace.openTextDocument(uri);
    }

    public updateDocument(content: string): void {
        const uri  = vscode.Uri.parse(`qix:/remote/abc/scripts/main.qvs`);
        const path = uri.toString(true);

        if (!this.files.has(path)) {
            return;
        }
        const source = this.files.get(path) as string;
        if (source !== content) {
            this.files.set(path, content);
        }
    }

}
