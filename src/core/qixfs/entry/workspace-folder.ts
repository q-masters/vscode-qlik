import { AuthorizationService } from "@core/authorization";

/**
 * QixWorkspaceFolder represents the connection to the Qlik Server
 */
export class QixWorkspaceFolder {

    private _connection: Promise<EnigmaSession>;

    private authService: AuthorizationService

    public constructor(
        private connectionModel: ConnectionSetting,
        private name: string
    ) {
        this.authService = AuthorizationService.getInstance();
    }

    /**
     * gute frage was ist wenn die
     */
    public get connection(): Promise<EnigmaSession> {
        if (!this._connection) {
            this._connection = this.establishConnection();
        }
        return this._connection;
    }

    public destroy() {
        throw new Error("@todo implement");
    }

    /**
     * create requires authorization now
     * we have to create a enigma session
     */
    private async establishConnection(): Promise<EnigmaSession> {
        this.connectionModel = await this.authService.authorize(this.connectionModel);

        if (this.connectionModel.authorized) {
            return new EnigmaSession(this.connectionModel);
        }

        throw new Error(`could not login to: ${this.connectionModel.host}`);
    }
}
