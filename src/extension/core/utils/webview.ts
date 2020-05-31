import * as vscode from "vscode";
import { posix } from "path";
import fs, { existsSync, statSync } from "fs";

/**
 * abstract webview class
 *
 * generic param T: message format we resolve from html view
 */
export abstract class VsQlikWebview<T> {

    protected view: vscode.WebviewPanel;

    /**
     * get full path to html file for our webview
     */
    public abstract getViewPath(): string;

    /**
     * message resolved from webview
     */
    public abstract handleMessage(message: T): void;

    /** render webview */
    public render(id: string, title: string): vscode.WebviewPanel {
        this.view = vscode.window.createWebviewPanel(id, title, vscode.ViewColumn.One, { enableScripts: true });
        this.view.webview.html = this.getHtml();
        this.view.webview.onDidReceiveMessage((message: T) => this.handleMessage(message));
        return this.view;
    }

    /** webview gets closed */
    public close() {
        this.view.dispose();
    }

    /** send message to inner view */
    protected send<T>(message: T) {
        this.view.webview.postMessage(message);
    }

    /**
     * resolve html data
     */
    private getHtml(): string {
        const path    = this.getViewPath();
        console.log(path);
        const fileUri = vscode.Uri.file(posix.dirname(path));
        const baseUri = this.view.webview.asWebviewUri(fileUri);

        if (existsSync(path) && statSync(path).isFile) {
            return fs
                .readFileSync(path, { encoding: 'utf8' })
                .replace('<base href="/">', `<base href="${String(baseUri)}/">`);
        }

        throw new Error(`Could not find file for webview: ${path}`);
    }
}
