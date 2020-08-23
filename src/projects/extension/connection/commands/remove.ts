import * as vscode from 'vscode';

export function RemoveConnectionCommand(workspacePath: string) {

    const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(workspacePath));
    if (folder) {
        vscode.workspace.updateWorkspaceFolders(1, 1);
        vscode.window.showInformationMessage(`Workspacefolder has been removed: ${folder.name}`);
    }
}
