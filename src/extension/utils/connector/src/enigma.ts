import * as vscode from "vscode";
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import schema from 'enigma.js/schemas/12.20.0.json';
import { QlikConnector, Entry, FileEntry } from './connector';
import WebSocket from "ws";
import { Route, ActivatedRoute } from "../../router";
import { CacheAble, cacheKey} from "../../cache";

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
}];

/**
 * opens connection through EngineAPI
 */
export class EnigmaConnector extends QlikConnector {

    public name: string;

    constructor(
        private configuration: EnigmaConfiguration,
        fs: vscode.FileSystemProvider
    ) {
        super(routes, fs);
        this.name = "Hallo Welt";
    }

    /**
     * load content by activated route
     */
    protected async loadContent(activatedRoute: ActivatedRoute): Promise<Entry[]> {

        switch (activatedRoute.action) {
            case Action.DOCLIST: 
                return await this.loadDoclistAction();

            case Action.SCRIPT:
                return await this.loadAppScriptAction(activatedRoute.params.app);

            default: 
                return [];
        }
    }

    /**
     * get current connection to enigma
     */
    @CacheAble()
    private async openEngine() {
        return await this.createSession();
    }

    @CacheAble()
    private async openApp(@cacheKey appId: string): Promise<EngineAPI.IApp> {
        const session = await this.createSession();
        return session.openDoc(appId);
    }

    private createSession(): Promise<EngineAPI.IGlobal> {
        const url = this.buildUri();
        const session = create({schema, url, createSocket: (url: string) => new WebSocket(url)})
        return session.open();
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
     * get doc list from enigma
     */
    private async loadDoclistAction(): Promise<Entry[]> {
        const connection = await this.openEngine();
        const docList: EngineAPI.IDocListEntry[] = await connection.getDocList() as any;

        /** map doclist to array */
        return docList.map<Entry>((entry) => {
            return {
                name: entry.qDocName,
                type: vscode.FileType.Directory
            };
        });
    }

    /**
     * load app script
     */
    private async loadAppScriptAction(app: string): Promise<FileEntry[]> {

        // das kommt nicht aus dem Cache
        const session    = await this.openApp(app);
        const script     = await session.getScript();

        return [{
            content: Buffer.from(script, "utf8"),
            name: "main.qvs",
            type: vscode.FileType.File
        }]
    }
}
