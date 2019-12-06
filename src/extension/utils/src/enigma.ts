import * as vscode from "vscode";
import { create } from 'enigma.js';
import { buildUrl } from 'enigma.js/sense-utilities';
import schema from 'enigma.js/schemas/12.20.0.json';
import WebSocket from "ws";

export interface EnigmaConfiguration {
    domain: string;
    port: number;
    secure: boolean;
}

/**
 * opens connection through EngineAPI
 */
export class EnigmaProvider {

    constructor(
        private configuration: EnigmaConfiguration
    ) {}

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
     */
    public connect(): Promise<EngineAPI.IGlobal> {
        return this.createSession();
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