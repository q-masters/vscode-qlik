import { singleton, inject } from "tsyringe";
import * as vscode from "vscode";
import { SettingsRepository } from "projects/extension/settings/settings.repository";

import { WorkspaceFolder } from "../data/workspace-folder";
import { WorkspaceFolderScheme } from "../api/api";

@singleton()
export class WorkspaceFolderRegistry {

    private workspaceFolders: Map<string, WorkspaceFolder>;

    public constructor(
        @inject(SettingsRepository) private settingsRepository: SettingsRepository
    ) {
        this.workspaceFolders = new Map();
    }

    /**
     * register a workspace folder
     */
    public register(folders: readonly WorkspaceFolderScheme[]) {

        for(let i = 0, ln = folders.length; i < ln; i++) {
            const folder  = folders[i];

            if (this.workspaceFolders.has(folder.name)) {
                continue;
            }

            const setting = this.settingsRepository.find(folder.name);
            if (!setting || folder.uri.scheme !== "qix") {
                continue;
            }

            const workspaceFolder = new WorkspaceFolder(setting);

            if (!this.workspaceFolders.has(folder.name)) {
                this.workspaceFolders.set(folder.name, workspaceFolder);
            }
        }
    }

    /**
     * resolve existing workspace folder
     */
    public resolve(folder: vscode.WorkspaceFolder): WorkspaceFolder | undefined {
        return this.workspaceFolders.get(folder.name);
    }

    /**
     * resolve workspace folder by given uri
     */
    public resolveByUri(uri: vscode.Uri): WorkspaceFolder | undefined {
        const folder = vscode.workspace.getWorkspaceFolder(uri);
        return folder ? this.resolve(folder) : void 0;
    }

    public create() {
    }

    public delete() {
    }
}
