import * as vscode from "vscode";
import { singleton } from "tsyringe";
import { Connection } from "./connection";

@singleton()
export class ConnectionProvider {

    private connectionIsRunning = false;

    private items: Connection[] = [];

    private folders: WeakMap<Connection, string> = new WeakMap();

    private connections: Map<string, Connection> = new Map();

    /**
     * connect to a server
     */
    public async connect(connection: Connection) {
        this.connections.set(connection.workspacePath, connection);
        this.items.push(connection);

        if (!this.connectionIsRunning) {
            await this.run();
        }
    }

    /**
     * close a connection
     */
    public close(path: string) {
        const connection = this.connections.get(path);

        if (connection) {
            connection.destroy();
            this.connections.delete(path);
        }
    }

    /**
     * resolve an connection by a given uri
     */
    public resolve(uri: string): Connection | undefined {
        return this.connections.get(uri);
    }

    /**
     * run all connections we currently have in a queue
     */
    private async run(): Promise<void> {
        let connection = this.items.shift();
        this.connectionIsRunning = true;

        while (connection) {
            if (! await connection.connect()) {
                vscode.commands.executeCommand('VsQlik.Connection.Remove', connection.workspacePath);
            }
            connection = this.items.shift();
        }
        this.connectionIsRunning = false;
    }
}
