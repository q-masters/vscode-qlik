import { WorkspaceSetting } from "projects/extension/settings/api";
import { EnigmaSession } from "projects/shared/connection";

export declare type ApplicationStorage = Map<string, string>;

export class WorkspaceFolder {

    private folderSettings: WorkspaceSetting;

    private connected: boolean;

    private enigmaSession: EnigmaSession;

    public constructor(setting: WorkspaceSetting) {
        this.folderSettings = setting;
    }

    public set isConnected(connected: boolean) {
        this.connected = connected;
    }

    public get isConnected(): boolean {
        return this.connected;
    }

    public get settings(): WorkspaceSetting {
        return this.folderSettings;
    }
}
