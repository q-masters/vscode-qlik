import * as vscode from "vscode";
import { ConnectionSettings, ConnectionQuickPickItem, WorkspaceFolderScheme } from "../../data";
import { SessionCache } from "@utils";

/**
 * add new workspace folder by given connection settings
 * maybe we find a betterplace for you little command ...
 */
export async function ConnectionCreateCommand() {

    const connectionRepository = SessionCache.get(ConnectionSettings);
    const availableConnections = connectionRepository.read();

    if (availableConnections.length === 0) {
        return;
    }

    const items = availableConnections.map<ConnectionQuickPickItem>((connection) => ({label: connection.label, connection }));
    const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});

    if (selection) {
        const name = selection.connection.label;
        const uri  = vscode.Uri.parse(`qix://${selection.connection.settings.host}:${selection.connection.settings.port}`);
        const newWorkspaceFolder: WorkspaceFolderScheme = {uri, name};

        if (!vscode.workspace.getWorkspaceFolder(uri)) {
            vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0 , 0, newWorkspaceFolder);
            /** after we have added a folder we need to be aware of it since we have to create a qlik connection */
        } else {
            vscode.window.showInformationMessage(`Workspacefolder ${uri.toString()} allready exists.`);
        }
    }
}
