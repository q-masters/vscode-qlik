import {workspace, WorkspaceConfiguration, ConfigurationTarget, ConfigurationChangeEvent} from "vscode";
import { SETTINGS } from "../../shared";

export interface ConnectionSetting {
    host: string;
    path: string;
    port: number;
    secure: boolean;
}

export class ConnectionService {

    private static instance: ConnectionService;

    private configuration: WorkspaceConfiguration;

    private constructor() {
        this.configuration = workspace.getConfiguration();
        workspace.onDidChangeConfiguration(this.onConfigurationChanged, this);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new ConnectionService();
        }
        return this.instance;
    }

    public async add(connection: ConnectionSetting): Promise<void> {
        const settings    = this.getAll();
        const newSettings = [...settings, connection];
        return this.configuration.update(SETTINGS.CONNECTION, newSettings, ConfigurationTarget.Global);
    }

    public async delete(connection: ConnectionSetting): Promise<void> {
    }

    public async update(connection: ConnectionSetting, old: ConnectionSetting) {}

    public getAll(): ConnectionSetting[] {
        return this.configuration.get(SETTINGS.CONNECTION) as ConnectionSetting[];
    }

    private onConfigurationChanged(event: ConfigurationChangeEvent) {
        if (event.affectsConfiguration(SETTINGS.CONNECTION)) {
            this.configuration = workspace.getConfiguration();
        }
    }
}
