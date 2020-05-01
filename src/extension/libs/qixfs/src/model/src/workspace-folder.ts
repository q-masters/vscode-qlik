import { EnigmaSession, AuthService } from "extension/libs/enigma";

/**
 * QixWorkspaceFolder represents the connection to the Qlik Server
 */
export class QixWorkspaceFolder {

    private _connection: Promise<EnigmaSession>;

    private sessionCookie: string;

    public constructor(
        private connectionSettings: any,
        private authService: AuthService
    ) {}

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

        const uriParts = [
           this.connectionSettings.secure ? 'https' : 'http', '://',
           this.connectionSettings.host,
        ];

        if (await this.authService.authorize(uriParts.join(""))) {
            const connection  = new EnigmaSession();
            connection.host   = this.connectionSettings.host;
            connection.port   = this.connectionSettings.port;
            connection.secure = this.connectionSettings.secure;

            this.authService.sessionCookies.forEach(cookie => {
                connection.addHeader(cookie.name, cookie.value as string);
            });

            return connection;
        }
        throw new Error();
    }
}
