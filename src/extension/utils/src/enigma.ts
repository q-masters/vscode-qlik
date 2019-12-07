import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import schema from 'enigma.js/schemas/12.20.0.json';
import WebSocket from "ws";
import { Cache } from "./cache";

export interface EnigmaConfiguration {
    domain: string;
    port: number;
    secure: boolean;
}

/**
 * opens connection through EngineAPI
 */
export class EnigmaProvider {

    private cache: Cache;

    constructor(
        private configuration: EnigmaConfiguration
    ) {
        this.cache = Cache.getInstance();
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

    public async openApp(appId: string): Promise<EngineAPI.IApp> {
        const key = `enigma.app.${appId}`;

        if (this.cache.has(key)) {
            return this.cache.get<EngineAPI.IApp>(key);
        }

        const session = await this.createSession();
        const app = await session.openDoc(appId);
        this.cache.set(key, app);
        return app;
    }

    public async closeApp(appId: string): Promise<void> {
        const app = this.cache.get<EngineAPI.IApp>(`enigma.app.${appId}`);
        if (app) {
            await app.session.close();
            this.cache.delete(`enigma.app.${appId}`);
        }
    }

    /**
     */
    public async connect(): Promise<EngineAPI.IGlobal> {
        const key   = "enigma.global";
        let session = this.cache.get<EngineAPI.IGlobal>(key);

        if (!session) {
            session = await this.createSession();
            this.cache.set(key, session);
        }
        return session;
    }

    /**
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
}
