import { ExtensionPath } from "@data/tokens";
import { VsQlikWebview, SessionCache, SettingsRepository } from "@utils";
import { resolve } from "path";
import { ConnectionSetting, ConnectionSettings } from "../../data";
import { workspace, ConfigurationChangeEvent, window } from "vscode";

const enum Command {
    Create  = "create",
    Read    = "read",
    Update  = "update",
    Destroy = "destroy",
    Error   = "error"
}

declare type DefaultData  = ConnectionSetting;
declare type ListData     = ConnectionSetting[];
declare type MutationData = {source: ConnectionSetting, target: ConnectionSetting};

interface Request {
    command: Command,
    data: ConnectionSetting
}

interface Response<T> {
    command: Command,
    data: T
}

/**
 * works as controller between vscode and webview (angular app)
 */
export class ConnectionWebview extends VsQlikWebview<Request> {

    private connectionSettings: SettingsRepository<ConnectionSetting>;

    private isSilent = false;

    public constructor() {
        super();
        this.connectionSettings = SessionCache.get(ConnectionSettings);
        workspace.onDidChangeConfiguration(this.onConfigurationChanged, this);
    }

    /** path where our view html file is located */
    public getViewPath(): string {
        return resolve(SessionCache.get(ExtensionPath), 'dist/webview/connection/index.html');
    }

    /** we recived an message from our webview */
    public async handleMessage(message: Request): Promise<void> {

        /**
         * forces to ignore configuration changed event
         * will set on false after connection has changed event triggered
         */
        this.isSilent = true;

        switch (message.command) {
            case Command.Create:
                this.createConnection(message.data);
                break;

            case Command.Update:
                this.updateConnection(message.data);
                break;

            case Command.Destroy:
                this.destroyConnection(message.data);
                break;

            default:
                this.readConnections();
        }
    }

    /**
     * create a new connection and sends to webview
     */
    private async createConnection(setting: ConnectionSetting) {
        if (!this.isUniqe(setting)) {
            const error = `A connection with the name ${setting.label} allready exists`;
            window.showErrorMessage(error);
        } else {
            const created  = await this.connectionSettings.create(setting);
            this.sendResponse<MutationData>(Command.Create, {source: setting, target: created});
        }
    }

    /**
     * read all connections and sends to webview
     */
    private async readConnections() {
        const connections = this.connectionSettings.read();
        this.sendResponse<ListData>(Command.Read, connections);
        this.isSilent = false;
    }

    /**
     * update an connection and sends it back to webview,
     */
    private async updateConnection(setting: ConnectionSetting) {

        if (!this.isUniqe(setting)) {
            const error = `A connection with the name ${setting.label} allready exists`;
            window.showErrorMessage(error);
        } else {
            const updated = await this.connectionSettings.update(setting);
            this.sendResponse<MutationData>(Command.Update, {source: setting, target: updated});
        }
    }

    /**
     * destroy an existing connection
     */
    private async destroyConnection(connection: ConnectionSetting) {
        await this.connectionSettings.destroy(connection);
        this.sendResponse<DefaultData>(Command.Destroy, connection);
    }

    private onConfigurationChanged(event: ConfigurationChangeEvent) {
        if (!this.isSilent && event.affectsConfiguration('vsQlik.Connection')) {
            this.connectionSettings.reload();
        }
        this.isSilent = false;
    }

    private isUniqe(setting: ConnectionSetting): boolean  {
        const settings = this.connectionSettings.read();
        return !settings.some((connection) => connection.label === setting.label);
    }

    private sendResponse<T>(command: Command, data: T): void {
        this.send({command, data} as Response<T>);
    }
}
