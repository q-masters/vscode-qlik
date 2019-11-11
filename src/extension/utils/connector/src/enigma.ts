import { create } from 'enigma.js';
import schema from 'enigma.js/schemas/12.20.0.json';
import { QlikConnector, QlikApp } from './connector';
import WebSocket from "ws";

export interface ResultAppCreated {
    qSuccess: boolean;
    qAppId: string;
}

export interface EnigmaConfiguration {
    domain: string;

    port: number;

    secure: boolean;
}

/**
 * opens connection through EngineAPI
 */
export class EnigmaConnector implements QlikConnector {

    private connection: EngineAPI.IGlobal;

    constructor(
        private configuration: EnigmaConfiguration
    ) {}

    createApp(name: string): Thenable<EngineAPI.IApp> {
        throw new Error("Method not implemented.");
    }

    deleteApp(id: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    async readAppList(): Promise<QlikApp[]> {

        if (!this.connection) {
            await this.establishConnection();
        }

        /** handle wrong typeings, cast to any and then to list of doc list entries */
        const docList: EngineAPI.IDocListEntry[] = await this.connection.getDocList() as any;
        return docList.map<QlikApp>((entry) => ({
            id: entry.qDocId,
            name: entry.qDocName,
            script: ""
        }));
    }

    readScript(appId: string): Thenable<string> {
        throw new Error("Method not implemented.");
    }

    writeScript(appId: string, script: string): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

    private async establishConnection(): Promise<EngineAPI.IGlobal> {
        const session = create({
            schema,
            url: this.buildUri(),
            createSocket: (url: string) => new WebSocket(url),
        });
        this.connection = await session.open();
        return this.connection;
    }

    private buildUri(): string {
        const domain = this.configuration.domain;
        const port   = this.configuration.port;
        const protocol = this.configuration.secure ? "wss" : "ws";

        return `${protocol}://${domain}:${port}`;
    }
}
