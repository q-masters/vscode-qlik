import * as vscode from 'vscode';
import { container } from 'tsyringe';
import { ConnectionProvider } from '../utils/connection.provider';

export function RemoveConnectionCommand(workspacePath?: string) {

    if (!workspacePath) {
        return;
    }

    const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(workspacePath));
    console.dir(folder);
    if (folder) {
        try {
            console.log(vscode.workspace.workspaceFolders);
            vscode.workspace.updateWorkspaceFolders(folder.index, 1);

            const connectionProvider = container.resolve(ConnectionProvider);
            connectionProvider.close(workspacePath);

            vscode.window.showInformationMessage(`Workspacefolder has been removed: ${folder.name}`);
        } catch (error) {
            console.log(error);
        }
    }
}
