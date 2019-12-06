import * as vscode from "vscode";
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import schema from 'enigma.js/schemas/12.20.0.json';
import WebSocket from "ws";

import { Route, ActivatedRoute } from "../../router";
import { CacheAble, cacheKey} from "../../cache";
import { QlikConnector } from './connector';
import { posix } from "path";

export interface EnigmaConfiguration {
    domain: string;
    port: number;
    secure: boolean;
}

enum Action {
    DOCLIST       = 0,
    CREATE_APP    = 1,
    DELETE_APP    = 2,
    READ_APP      = 3,
    SCRIPT        = 4,
    WRITE_SCRIPT  = 5,
    DELETE_SCRIPT = 6,
}

const routes: Route[] = [{
    path: "/",
    action: Action.DOCLIST
}, {
    path: "/:app",
    action: Action.READ_APP
}, {
    path: "/:app/create",
    action: Action.CREATE_APP
}, {
    path: "/:app/delete",
    action: Action.DELETE_APP
}, {
    path: "/:app/write",
    action: Action.WRITE_SCRIPT
}];

/**
 * opens connection through EngineAPI
 */
export class EnigmaConnector extends QlikConnector {

    constructor(private configuration: EnigmaConfiguration) {
        super(routes);
    }

    /**
     * load content by activated route
     */
    protected async routeActivated(route: ActivatedRoute): Promise<any> {

        switch (route.action) {
            case Action.DOCLIST: 
                return await this.loadDoclistAction();

            case Action.CREATE_APP:
                return await this.createAppAction(route.params.app);

            case Action.DELETE_APP:
                return await this.deleteAppAction(route.params.app);

            case Action.READ_APP:
                return await this.loadAppScriptAction(route.params.app);

            case Action.WRITE_SCRIPT:
                return await this.loadAppScriptAction(route.params.app);

            default: 
                return [];
        }
    }

    /**
     * build uri for websocket
     */
    private buildUri(): string {
        return buildUrl({
            appId   : "engineData",
            host    : this.configuration.domain,
            identity: Math.random().toString(32).substr(2),
            port    : this.configuration.port,
            secure  : this.configuration.secure,
        });
    }

    /**
     * @throws MaximumSessionCountReachedException
     */
    private async createSession(): Promise<EngineAPI.IGlobal> {
        const url = this.buildUri();
        const session = create({
            schema, url,
            createSocket: (url: string) => new WebSocket(url)
        });

        const global = await session.open() as EngineAPI.IGlobal;
        return global;
    }

    /**
     * get doc list from enigma
     */
    private async loadDoclistAction(): Promise<[string, vscode.FileType][]> {
        const connection = await this.openEngine();
        const docList: EngineAPI.IDocListEntry[] = await connection.getDocList() as any;
        return docList.map<[string, vscode.FileType]>((entry) => [entry.qDocName, vscode.FileType.Directory]);
    }

    /**
     * load app script
     */
    private async loadAppScriptAction(app: string): Promise<[string, vscode.FileType][]> {

        const session = await this.openApp(app);
        const script  = await session.getScript();

        /**
         * das ist nun doof hier
         */
        return [["main.qvs", vscode.FileType.File]];
    }

    private async createAppAction(app: string): Promise<[string, vscode.FileType][]> {
        const session = await this.openEngine();
        const newApp  = await session.createApp(app);
        return [[posix.basename(newApp.qAppId), vscode.FileType.Directory]];
    }

    /**
     * @todo remove app session from cache
     */
    private async deleteAppAction(app: string): Promise<boolean> {
        const session = await this.openEngine();
        return session.deleteApp(app);
    }

    @CacheAble()
    private async openApp(@cacheKey appId: string): Promise<EngineAPI.IApp> {
        try {
            const session = await this.createSession();
            const app = await session.openDoc(appId);
            return app;
        } catch (error) {
            vscode.window.showErrorMessage(`Could not open app: ${appId}.`);
            /** throw error so promise will rejected and value will removed from cache */
            throw error;
        }
    }

    /**
     * get current connection to enigma
     */
    @CacheAble()
    private openEngine(): Promise<EngineAPI.IGlobal> {
        return this.createSession();
    }
}
