import { ExtensionPath } from "@data/tokens";
import { VsQlikWebview, SessionCache, SettingsRepository } from "@utils";
import { resolve } from "path";
import { workspace, window, ConfigurationChangeEvent } from "vscode";
import { CONNECTION_REPOSITORY } from "../data";
import { Connection } from "../api";

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
        data: Connection
    };
}

interface WebviewResponse {
    request: WebviewRequest;
    body: Connection;
    success: boolean;
    error: string;
}

/**
 * works as controller between vscode and webview (angular app)
 */
export class ConnectionSettingsWebview extends VsQlikWebview<WebviewRequest> {

    private settingsRepository: SettingsRepository<Connection>;

    private isSilent = false;

    public constructor() {
        super();
        this.settingsRepository = SessionCache.get(CONNECTION_REPOSITORY);
        workspace.onDidChangeConfiguration(this.onConfigurationChanged, this);
    }

    /**
     * path where our view html file is located
     */
    public getViewPath(): string {
        return resolve(SessionCache.get(ExtensionPath), 'dist/webview/connection/index.html');
    }

    /**
     * we recived an message from our webview
     */
    public async handleMessage(request: WebviewRequest): Promise<void> {

        /**
         * forces to ignore configuration changed event
         * will set on false after connection has changed event triggered
         */
        this.isSilent = true;

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

        if (this.settingsRepository.exists(setting.label)) {
            const error = `A connection with the name ${setting.label} allready exists`;
            window.showErrorMessage(error);
        } else {
            const created  = await this.settingsRepository.create(setting);
            this.send<WebviewResponse>({request, body: created, success: true, error: ""});
        }
    }

    /**
     * read all connections and sends to webview
     */
    private async readConnections(request: WebviewRequest) {
        const connections = this.settingsRepository.read();
        this.send({request, body: connections, success: true });
    }

    /**
     * update an connection and sends it back to webview,
     */
    private async updateConnection(request: WebviewRequest) {
        const setting = request.body.data;

        if (this.settingsRepository.exists(setting.uid)) {
            await this.settingsRepository.update(setting);
            this.send({request, body: setting, success: true});
        }

        /** @todo show error */
    }

    /**
     * destroy an existing connection
     */
    private async destroyConnection(request: WebviewRequest) {
        const setting = request.body.data;
        await this.settingsRepository.destroy(setting);
        this.send({request, body: {}, success: true});
    }

    /**
     * configuration has been changed reload webview
     */
    private onConfigurationChanged(event: ConfigurationChangeEvent) {
        if (!this.isSilent && event.affectsConfiguration('vsQlik.Connection')) {
            this.settingsRepository.reload();
        }
        this.isSilent = false;
    }

    /**
     * check setting is uniqe
     */
    private isUniqe(setting: Connection): boolean  {
        return this.settingsRepository.exists(setting.label);
    }
}
