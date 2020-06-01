import { WorkspaceSetting } from "@vsqlik/settings/api";
import { EnigmaSession } from "@core/connection";

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

    public set settings(setting: WorkspaceSetting) {
    }

    public get settings(): WorkspaceSetting {
        return this.folderSettings;
    }

    public get connection(): EnigmaSession {
        return this.enigmaSession;
    }

    public set connection(session: EnigmaSession) {
        this.enigmaSession = session;
    }
}
