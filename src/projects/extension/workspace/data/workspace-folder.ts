import { WorkspaceSetting } from "projects/extension/settings/api";
import { EnigmaSession, DisplaySettings } from "projects/shared/connection";

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

    public get displaySettings(): DisplaySettings {

        const dSettings = this.settings.display;

        return {
            dimensions: dSettings?.dimensions ?? true,
            measures: dSettings?.measures ?? true,
            script: dSettings?.script ?? true,
            sheets: dSettings?.sheets ?? true,
            variables: dSettings?.variables ?? true
        };
    }
}
