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

        /**
         * connection setting ist hier wichtig
        const auth          = AuthorizationFactory.createFormStrategy('http://windows-10-privat.shared');
        const sessionCookie = await auth.authorize();
         */

        /**
         * wenn ich den session cookie nun habe muss ich den speichern
         */

        /**
         * erstellt eine neue connection und muss selbige auch weiter reichen
         * aber erst wenn er das verzeichniss öffnen will muss er sich authorisieren sonst wird das nix
         */

        const name = selection.connection.label;
        const uri  = vscode.Uri.parse(`qix://${selection.connection.settings.host}:${selection.connection.settings.port}`);
        const newWorkspaceFolder: WorkspaceFolderScheme = {uri, name};

        /**
         * macht er hier eine Workspace Folder auf ?
         */
        if (!vscode.workspace.getWorkspaceFolder(uri)) {
            vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0 , 0, newWorkspaceFolder);
        } else {
            vscode.window.showInformationMessage(`Workspacefolder ${uri.toString()} allready exists.`);
        }
    }
}
