import * as vscode from "vscode";
import { SettingsService, ConnectionSetting } from "./settings.service";

interface ConnectionQuickPickItem extends vscode.QuickPickItem {
    connection: ConnectionSetting
}

interface WorkspaceFolderScheme {
    uri: vscode.Uri,
    name: string
}

/**
 * add new workspace folder by given connection settings
 * maybe we find a betterplace for you little command ...
 */
export async function ConnectionCreateCommand() {

    const connectionService = SettingsService.getInstance();
    const availableConnections = connectionService.getAll();

    if (availableConnections.length === 0) {
        return;
    }

    const items = availableConnections.map<ConnectionQuickPickItem>((connection) => ({
        label: `${connection.host}:${connection.port}/${connection.path}`,
        connection
    }));

    const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});
    if (selection) {

        const name = `${selection.connection.host}:${selection.connection.port}`;
        const uri = vscode.Uri.parse(`qix://${name}`);
        const newWorkspaceFolder: WorkspaceFolderScheme = { uri, name };

        if (!vscode.workspace.getWorkspaceFolder(uri)) {
            vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0 , 0, newWorkspaceFolder);
            /** after we have added a folder we need to be aware of it since we have to create a qlik connection */
        } else {
            vscode.window.showInformationMessage(`Workspacefolder ${uri.toString()} allready exists.`);
        }
    }
}
