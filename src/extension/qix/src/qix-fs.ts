import * as vscode from "vscode";
import { ConnectionService, ConnectionSetting } from "../../connection";
import { EnigmaSessionManager } from "../../enigma";
import { SessionCache, ExtensionContext } from "../../shared";
import { DocumentsDirectory } from "./documents-directory";
import { QixFSProvider } from "./qix-fs.provider";

export enum QixFsAction {
    INIT
}

interface ConnectionQuickPickItem extends vscode.QuickPickItem {
    connection: ConnectionSetting
}

export class QixFs {

    private static instance: QixFs;
    private connectionService: ConnectionService;
    private extensionContext: vscode.ExtensionContext;

    private constructor() {
        this.connectionService = ConnectionService.getInstance();
        this.extensionContext  = SessionCache.get(ExtensionContext);
    }

    public static run(action: QixFsAction) {

        if (!this.instance) {
            this.instance = new QixFs();
        }

        switch (action) {
            case QixFsAction.INIT:
                this.instance.initializeNewQixFs();
                break;
        }
    }

    /**
     * initialize new qix fs file system
     * this will first ask for all connections we have here
     */
    private async initializeNewQixFs() {
        const availableConnections = this.connectionService.getAll();

        if (availableConnections.length === 0) {
            // show error or run create connection
            return;
        }

        const items = availableConnections.map<ConnectionQuickPickItem>((connection) => {
            const label = `${connection.host}:${connection.port}/${connection.path}`;
            return { label, connection }
        });

        const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});
        if (selection) {
            this.createWorkspaceFolder(selection.connection);
        }
    }

    private createWorkspaceFolder(connection: ConnectionSetting) {

        const enigmaSessionManager = new EnigmaSessionManager(connection.host, connection.port, connection.secure);
        const rootDir = new DocumentsDirectory(enigmaSessionManager);
        const qixFs = new QixFSProvider(rootDir);

        console.log(connection);

        this.extensionContext.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('qix:/'), name: `qix:/localhost:9076`});
    }
}
