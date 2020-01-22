import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ConnectionService, ConnectionSetting } from "../../utils";

export enum ViewCommand {
    ADD = 'add',
    DELETE = 'delete'
}

interface WebviewMessage {
    command: ViewCommand;
    data: ConnectionSetting;
}

export class ConnectionWebview {

    private view: vscode.WebviewPanel;

    private connectionService: ConnectionService;

    private isDisposed: boolean = false;

    constructor() {
        this.connectionService = ConnectionService.getInstance(); 
    }

    public render(): vscode.WebviewPanel {

        if (!this.view || this.isDisposed) {
            this.view = vscode.window.createWebviewPanel(
                "VSQlik.Connection.Create",
                "VSQlik Connection Create",
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            const template  = path.resolve(__dirname, './connection.html');
            this.view.webview.html = fs.readFileSync(template, {encoding: "utf8"});

            this.view.webview.onDidReceiveMessage((message: WebviewMessage) => this.handleMessage(message));
            this.view.onDidDispose(() => this.isDisposed = true);

            this.view.onDidChangeViewState((event) => {
                if(event.webviewPanel.visible) {
                    this.updateConnections();
                }
            });
        }

        this.updateConnections();
        return this.view;
    }

    public close() {
        this.view.dispose();
    }

    public send(message) {
        this.view.webview.postMessage(message);
    }

    private async handleMessage(message: WebviewMessage) {
        switch (message.command) {
            case ViewCommand.ADD:
                this.addNewConnection(message.data); 
                break;

            case ViewCommand.DELETE:
                break;
        }
    }

    private async addNewConnection(data: ConnectionSetting) {
    }

    private async deleteConnection(data: ConnectionSetting) {
        this.updateConnections();
    }

    private updateConnections() {
        const connections = this.connectionService.getAll();
        this.view.webview.postMessage({command: 'update', connections});
    }
}
