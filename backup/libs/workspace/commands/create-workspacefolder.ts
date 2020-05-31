import * as vscode from "vscode";
import { SettingsRepository } from "backup/utils";
import { WorkspaceFolderScheme, WorkspaceFolderQuickPickItem } from "../api";

/**
 * create a new workspace folder for given connection
 */
export async function CreateWorkspaceFolderCommand(
    @Inject(SettingsRepository) settingsRepository: SettingsRepository
) {

    const availableConnections = settingsRepository.read();

    if (availableConnections.length === 0) {
        return;
    }

    const items = availableConnections.map<WorkspaceFolderQuickPickItem>((connection) => ({label: connection.label, connection }));
    const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});

    if (selection) {
        const path         = createWorkspaceFolderPath(selection.connection);
        const workspaceUri = vscode.Uri.parse(path);

        const newWorkspaceFolder: WorkspaceFolderScheme = {
            uri: vscode.Uri.parse(path),
            name: selection.connection.label
        };

        if (!vscode.workspace.getWorkspaceFolder(workspaceUri)) {
            vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0 , 0, newWorkspaceFolder);
        } else {
            vscode.window.showInformationMessage(`Workspacefolder ${path} allready exists.`);
        }
    }
}

function createWorkspaceFolderPath(connection: Connection): string {
    const path = `qix://`;
    return path.concat(connection.label, '.', connection.host);
}
