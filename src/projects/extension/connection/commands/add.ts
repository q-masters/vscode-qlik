import * as vscode from "vscode";
import { ConnectionHelper } from "../utils/connection.helper";
import { ConnectionProvider } from "../utils/connection.provider";
import { container } from "tsyringe";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { Connection } from "../utils/connection";

/**
 * create a new workspace folder for given connection
 */
export async function AddConnectionCommand(workspace?: vscode.WorkspaceFolder) {

    const workspaceFolderName = workspace?.name;

    let uri = workspace?.uri;
    let setting: WorkspaceSetting | undefined;

    const workspaceFoldersLn = vscode.workspace.workspaceFolders?.length ?? 0;

    if (!workspace) {
        setting = await ConnectionHelper.selectConnection();
        if (setting) {
            const name = setting.label;
            const path = `qix://`.concat(setting.label, '.', setting.connection.host, setting.connection.path ?? '/');
            uri = vscode.Uri.parse(path, true);

            const newWorkspaceFolder = { name, uri };
            if (vscode.workspace.getWorkspaceFolder(uri)) {
                vscode.window.showInformationMessage(`Workspacefolder ${name} allready exists.`);
                return;
            }

            vscode.workspace.updateWorkspaceFolders(workspaceFoldersLn, 0, newWorkspaceFolder);
        }

        /**
         * @see https://github.com/Microsoft/vscode/issues/51088#issuecomment-395004926
         *
         * if this is the first workspace which is added, it will restart extension host and we run into this again
         * now the second time we come in it will directly find a qix directory which we have to connect.
         *
         * This also ensures we dont run some useless http requests
         */
        if( workspaceFoldersLn === 0) {
            return;
        }
    } else {
        setting = container.resolve(SettingsRepository).find(workspaceFolderName ?? '');
    }

    if (setting && uri) {
        const connection = new Connection(setting, uri.toString(true));
        container.resolve(ConnectionProvider).connect(connection);
    }
}
