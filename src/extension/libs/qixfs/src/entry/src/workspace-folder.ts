import { EnigmaSession } from "extension/libs/enigma";
import { AuthorizationService, FormAuthorizationStrategy } from "@lib/connection";

/**
 * QixWorkspaceFolder represents the connection to the Qlik Server
 */
export class QixWorkspaceFolder {

    private _connection: Promise<EnigmaSession>;

    private authService: AuthorizationService

    public constructor(
        private connectionSettings: any,
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
    }

    /**
     * create requires authorization now
     * we have to create a enigma session
     */
    private async establishConnection(): Promise<EnigmaSession> {

        const authStrategy = new FormAuthorizationStrategy(this.connectionSettings);
        authStrategy.title = `Login: ${this.name}`;

        const authorize    = await this.authService.authorize(authStrategy) ;

        if (authorize) {
            const connection  = new EnigmaSession();
            connection.host   = this.connectionSettings.host;
            connection.port   = this.connectionSettings.port;
            connection.secure = this.connectionSettings.secure;

            authorize.forEach(cookie => {
                connection.addHeader(cookie.name, cookie.value as string);
            });
            return connection;
        }
        throw new Error();
    }
}
