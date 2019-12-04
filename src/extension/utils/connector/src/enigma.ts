import * as vscode from "vscode";
import { create } from 'enigma.js';
import schema from 'enigma.js/schemas/12.20.0.json';
import { QlikConnector } from './connector';
import WebSocket from "ws";
import { Route, ActivatedRoute } from "../../router";

export interface ResultAppCreated {
    qSuccess: boolean;
    qAppId: string;
}

export interface EnigmaConfiguration {
    domain: string;

    port: number;

    secure: boolean;
}

enum Action {
    DOCLIST = 'doclist',
    SCRIPT  = 'app_script'
}

const routes: Route[] = [{
    path: "/docker",
    action: Action.DOCLIST
}, {
    path: "/docker/:app",
    action: Action.SCRIPT
}, {
    path: "/docker/:app/script",
    action: Action.DOCLIST
}];

declare type FSEntry = [string, vscode.FileType];

/**
 * opens connection through EngineAPI
 */
export class EnigmaConnector extends QlikConnector {

    private connection: EngineAPI.IGlobal;

    constructor(
        private configuration: EnigmaConfiguration
    ) {
        super(routes);
    }

    protected async loadContent(activatedRoute: ActivatedRoute): Promise<FSEntry[]> {

        switch (activatedRoute.action) {
            case Action.DOCLIST: 
                return await this.loadDoclistAction();

            case Action.SCRIPT:
                return await this.getAppScript(activatedRoute.params.app);
        }

        return [];
    }

    private async getAppScript(app: string): Promise<FSEntry[]> {

        const connection = await this.getConnection();
        const session    = await connection.openDoc(app);
        const script     = await session.getScript();

        const scriptFile = new Buffer(script, "utf8");

        return [];
    }

    private async getConnection(): Promise<EngineAPI.IGlobal> {

        if (this.connection) {
            return this.connection;
        }

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

    private async loadDoclistAction(): Promise<FSEntry[]> {
        const connection = await this.getConnection();
        const docList: EngineAPI.IDocListEntry[] = await connection.getDocList() as any;

        /** map doclist to array */
        return docList.map((entry) => {
            return [entry.qDocName, vscode.FileType.Directory]
        });
    }
}
