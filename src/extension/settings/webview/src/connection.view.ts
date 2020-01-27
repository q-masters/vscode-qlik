import * as vscode from "vscode";
import template from "./connection.html";
import { SettingsService, ConnectionSetting } from "../../utils/src/settings.service";

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

    private connectionService: SettingsService;

    private isDisposed: boolean = false;

    constructor() {
        this.connectionService = SettingsService.getInstance(); 
    }

    public render(): vscode.WebviewPanel {

        if (!this.view || this.isDisposed) {
            this.view = vscode.window.createWebviewPanel(
                "VSQlik.Connection.Create",
                "VSQlik Connection Create",
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            this.view.webview.html = template;

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
        this.updateConnections();
    }

    private async deleteConnection(data: ConnectionSetting) {
        this.updateConnections();
    }

    private updateConnections() {
        const connections = this.connectionService.getAll();
        this.view.webview.postMessage({command: 'update', connections});
    }
}
