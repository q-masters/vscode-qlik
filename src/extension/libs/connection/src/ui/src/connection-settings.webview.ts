import { ExtensionPath } from "@data/tokens";
import { VsQlikWebview, SessionCache, SettingsRepository } from "@utils";
import { resolve } from "path";
import { workspace, ConfigurationChangeEvent, window } from "vscode";
import { ConnectionSetting, ConnectionSettings } from "../../data";

const enum Action {
    Create  = "create",
    Read    = "read",
    Update  = "update",
    Destroy = "destroy",
    Error   = "error"
}

interface WebviewRequest {
    header: {requestId: string};
    body: {
        action: Action;
        data: ConnectionSetting
    };
}

interface WebviewResponse {
    request: WebviewRequest;
    body: ConnectionSetting;
    success: boolean;
    error: string;
}

/**
 * works as controller between vscode and webview (angular app)
 */
export class ConnectionSettingsWebview extends VsQlikWebview<WebviewRequest> {

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
    public async handleMessage(request: WebviewRequest): Promise<void> {
        /**
         * forces to ignore configuration changed event
         * will set on false after connection has changed event triggered
         */
        this.isSilent = true;

        console.log(request);

        switch (request.body.action) {
            case Action.Create:  this.createConnection(request);  break;
            case Action.Update:  this.updateConnection(request);  break;
            case Action.Destroy: this.destroyConnection(request); break;
            case Action.Read:    this.readConnections(request);   break;
        }
    }

    /**
     * create a new connection and sends to webview
     */
    private async createConnection(request: WebviewRequest) {

        const setting = request.body.data;

        if (!this.isUniqe(setting, true)) {
            const error = `A connection with the name ${setting.label} allready exists`;
            window.showErrorMessage(error);
        } else {
            const created  = await this.connectionSettings.create(setting);
            this.send<WebviewResponse>({request, body: created, success: true, error: ""});
        }
    }

    /**
     * read all connections and sends to webview
     */
    private async readConnections(request: WebviewRequest) {
        const connections = this.connectionSettings.read();
        this.send({request, body: connections, success: true });
    }

    /**
     * update an connection and sends it back to webview,
     */
    private async updateConnection(request: WebviewRequest) {
        const setting = request.body.data;
        console.log(setting);
        if (!this.isUniqe(setting)) {
            const error = `A connection with the name ${setting.label} allready exists`;
            window.showErrorMessage(error);
            this.send({request, body: {}, success: false, error});
        } else {
            const updated = await this.connectionSettings.update(setting);
            this.send({request, body: updated, success: true});
        }
    }

    /**
     * destroy an existing connection
     */
    private async destroyConnection(request: WebviewRequest) {
        const setting = request.body.data;
        await this.connectionSettings.destroy(setting);
        this.send({request, body: {}, success: true});
    }

    private onConfigurationChanged(event: ConfigurationChangeEvent) {
        if (!this.isSilent && event.affectsConfiguration('vsQlik.Connection')) {
            this.connectionSettings.reload();
        }
        this.isSilent = false;
    }

    private isUniqe(setting: ConnectionSetting, isNew = false): boolean  {
        const settings = this.connectionSettings.read();
        return !settings.some((connection) =>
            !isNew && connection.uid === setting.uid ? false : connection.label === setting.label
        );
    }
}
