import * as vscode from "vscode";
import { ConnectionHelper } from "../utils/connection.helper";

/**
 * create a new workspace folder for given connection
 */
export async function AddConnectionCommand() {

    const setting = await ConnectionHelper.selectConnection();

    if (setting) {
        const name = setting.label;
        const path = `qix://`.concat(setting.label, '.', setting.connection.host, setting.connection.path ?? '/');
        const uri = vscode.Uri.parse(path, true);

        const newWorkspaceFolder = { name, uri };
        if (vscode.workspace.getWorkspaceFolder(uri)) {
            vscode.window.showInformationMessage(`Workspacefolder ${name} allready exists.`);
            return;
        }
        vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length ?? 0, 0, newWorkspaceFolder);
    }
}
