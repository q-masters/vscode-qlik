import * as vscode from "vscode";
import { ConnectionProvider } from "../utils/connection.provider";
import { container } from "tsyringe";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { Connection } from "../utils/connection";

/**
 * we have to wait until vscode.workspace.onDidChangeWorkspacefolder has been triggered
 * otherwise we could not remove workspacefolder safely, even it is registered in workspacefolders
 * it does not mean it could removed from file explorer tree.
 *
 * if the event is triggered it has been added to the file explorer and can safly removed
 */
export function ServerConnectCommand(workspace: vscode.WorkspaceFolder): void {

    const workspaceFolderName = workspace?.name;
    const uri = workspace.uri;
    const setting = container.resolve(SettingsRepository).find(workspaceFolderName ?? '');

    if (setting) {
        const connection = new Connection(setting, uri.toString(true));
        container.resolve(ConnectionProvider).connect(connection);
    }
}
