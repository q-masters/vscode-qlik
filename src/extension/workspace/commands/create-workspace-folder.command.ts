import * as vscode from "vscode";
import { container } from "tsyringe";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { WorkspaceFolderQuickPickItem, WorkspaceFolderScheme } from "../api/api";

/**
 * create a new workspace folder for given connection
 */
export async function CreateWorkspaceFolderCommand() {

    const settingsRepository   = container.resolve<SettingsRepository>(SettingsRepository);
    const availableConnections = settingsRepository.read();

    if (availableConnections.length === 0) {
        return;
    }

    const items = availableConnections.map<WorkspaceFolderQuickPickItem>((setting) => ({label: setting.label, setting }));
    const selection = await vscode.window.showQuickPick(items, {placeHolder: "Select Connection"});

    if (selection) {
        const path         = createWorkspaceFolderPath(selection.setting);
        const workspaceUri = vscode.Uri.parse(path);

        const newWorkspaceFolder: WorkspaceFolderScheme = {
            uri: vscode.Uri.parse(path),
            name: selection.setting.label
        };

        if (!vscode.workspace.getWorkspaceFolder(workspaceUri)) {
            vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0 , 0, newWorkspaceFolder);
        } else {
            vscode.window.showInformationMessage(`Workspacefolder ${path} allready exists.`);
        }
    }
}

function createWorkspaceFolderPath(setting: WorkspaceSetting): string {
    const path = `qix://`;
    return path.concat(setting.label, '.', setting.connection.host);
}
