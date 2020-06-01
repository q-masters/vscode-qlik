import { singleton, inject } from "tsyringe";
import * as vscode from "vscode";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { WorkspaceSetting } from "@vsqlik/settings/api";

@singleton()
export class WorkspaceFolderRegistry {

    private workspaceFolders: Map<string, WorkspaceSetting>;

    public constructor(
        @inject(SettingsRepository) private settingsRepository: SettingsRepository
    ) {
        this.workspaceFolders = new Map();
    }

    /**
     * register a workspace folder
     */
    public register(folders: readonly vscode.WorkspaceFolder[]) {

        for(let i = 0, ln = folders.length; i < ln; i++) {
            const folder  = folders[i];
            const setting = this.settingsRepository.find(folder.name);

            if (!setting || folder.uri.scheme !== "qix") {
                continue;
            }

            console.dir(folder);
            console.dir(setting);

            /**
             * better create a data model ?
             */
            // this.workspaceFolders.set(folder.uri.external, setting);
        }
    }
}
