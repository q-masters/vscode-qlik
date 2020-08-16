import * as vscode from "vscode";
import { singleton } from "tsyringe";
import { Connection } from "./connection";
import { ConnectionState } from "../model/connection";
import { filter, map, take, takeUntil } from "rxjs/operators";

@singleton()
export class ConnectionProvider {

    private connectionIsRunning = false;

    private items: Connection[] = [];

    private connections: Map<string, Connection> = new Map();

    /**
     * connect to a server
     */
    public async connect(connection: Connection) {
        console.log(connection.workspacePath);
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
    public resolve(uri: string): Promise<Connection | undefined> {
        const connection = this.connections.get(uri);

        if (!connection) {
            console.log("nein");
            console.log(uri);
            return Promise.resolve(void 0);
        }

        return connection.stateChange.pipe(
            takeUntil(connection.stateChange.pipe(
                filter((state) => state === ConnectionState.ERROR)
            )),
            filter((state: ConnectionState) => state === ConnectionState.CONNECTED),
            map(() => connection),
            take(1)
        ).toPromise();
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
