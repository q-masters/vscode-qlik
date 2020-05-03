import * as vscode from "vscode";
import { ConnectionSetting } from "@lib/connection";
import { QixWorkspaceFolder } from "../../entry/src/workspace-folder";

/**
 * holds all active workspace folders
 * which represented qlik servers
 */
export class WorkspaceFolderManager {

    private static workspaceFolders: WeakMap<vscode.WorkspaceFolder, QixWorkspaceFolder> = new WeakMap();

    private constructor () {
        throw new Error("could not create new instance use getInstance instead");
    }

    /**
     * add new folders, since this could be anything we filter out if we handle
     * a qix file system and we only save directories here which requires an enigma
     * connection.
     */
    public static addFolder(folders: ReadonlyArray<vscode.WorkspaceFolder>);
    public static addFolder(folders: Array<vscode.WorkspaceFolder>) {
        folders
            .filter((folder) => folder.uri.scheme === 'qix')
            .forEach((_) => this.addWorkspaceFolder(_));
    }

    public static removeFolder(folders: ReadonlyArray<vscode.WorkspaceFolder>);
    public static removeFolder(folders: Array<vscode.WorkspaceFolder>) {
        folders
            .filter((folder) => folder.uri.scheme === 'qix')
            .forEach(folder => this.closeWorkspaceFolder(folder));
    }

    /**
     * find our workspace folder by uri, default we could have multiple
     * workspace folders and each have an own enigma connection but qixfs provider
     * dosent know this.
     * 
     * so we need to find correct workspace folder and get the correct enigma session context.
     */
    public static resolveWorkspaceFolder(uri: vscode.Uri): QixWorkspaceFolder | undefined {
        const wsFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (wsFolder && wsFolder.uri.scheme === 'qix') {
            return this.workspaceFolders.get(wsFolder);
        }
        throw new Error("Workspace Folder not found");
    }

    public static find<T>(uri: vscode.Uri): T | undefined {
        return void 0;
    }

    /**
     * register new qix workspace folder
     * 
     * @param folder
     */
    private static addWorkspaceFolder(folder: vscode.WorkspaceFolder): void {

        const configuration = vscode.workspace.getConfiguration();
        const connections   = configuration.get<ConnectionSetting[]>(`vsQlik.Connection`);
        const connection    = connections?.find(setting => folder.name === setting.label);

        if (connection) {
            const qixWSFolder = new QixWorkspaceFolder(connection.settings);
            /** set auth strategy here ? */
            this.workspaceFolders.set(folder, qixWSFolder);
        }
    }

    /**
     * closes a qix workspace folder
     */
    private static closeWorkspaceFolder(folder: vscode.WorkspaceFolder) {
        const qixWorkspaceFolder = this.workspaceFolders.get(folder);
        qixWorkspaceFolder?.destroy();
        this.workspaceFolders.delete(folder);
    }

    /**
     * handle event if workspace folders has been changed (added or removed)
     */
    private static workspaceFolderChanged(event: vscode.WorkspaceFoldersChangeEvent) {

        if (event.added.length) {
            this.addFolder(event.added);
        }

        if (event.removed.length) {
            this.removeFolder(event.removed);
        }
    }
}
