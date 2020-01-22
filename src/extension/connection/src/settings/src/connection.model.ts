export class ConnectionModel {

    private connectionHost: string;

    private connectionPort: string;

    private connectionPath: string;

    private connectionSecure: boolean;

    public set host(host: string) {
        this.connectionHost = host;
    }

    public get host(): string {
        return this.connectionHost;
    }
}
