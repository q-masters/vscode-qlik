import * as vscode from 'vscode';

export function RemoveConnectionCommand(workspacePath: string): void {

    const folder = vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(workspacePath));
    if (folder) {
        vscode.workspace.updateWorkspaceFolders(folder.index, 1);
        vscode.window.showInformationMessage(`Workspacefolder has been removed: ${folder.name}`);
    }
}
