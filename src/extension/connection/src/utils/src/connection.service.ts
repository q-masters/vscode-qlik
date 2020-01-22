import {workspace, WorkspaceConfiguration, ConfigurationTarget, ConfigurationChangeEvent, Uri} from "vscode";
import { SessionCache, ConnectionSettings } from "../../../../utils";

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
        return this.configuration.update('VSQlik.connection.settings', newSettings, ConfigurationTarget.Global);
    }

    public async delete(connection: ConnectionSetting): Promise<void> {
    }

    public async update(connection: ConnectionSetting, old: ConnectionSetting) {}

    public getAll(): ConnectionSetting[] {
        return this.configuration.get('VSQlik.connection.settings') as ConnectionSetting[];
    }

    /**
     * create new connection which can stored into storage
     */
    public createConnection(uri: Uri, ) {
    }

    private onConfigurationChanged(event: ConfigurationChangeEvent) {
        if (event.affectsConfiguration(SessionCache.get(ConnectionSettings))) {
            this.configuration = workspace.getConfiguration();
        }
    }
}
