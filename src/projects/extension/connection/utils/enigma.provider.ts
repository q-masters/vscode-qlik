import WebSocket from "ws";
import { ConnectionHelper } from "./connection.helper";
import { ConnectionModel } from "../model/connection";
import { container } from "tsyringe";
import { VsQlikLoggerConnection } from "../api";

/**
 * Services to create, cache and handle enigma session
 *
 * ich müsste die gesammte klasse weg speichern
 * aber das ist auch nicht so übel sprach der dübel
 */
export class EnigmaSession {

    private static GLOBAL_SESSION_KEY = "engineData";

    /**
     * array of active session id's
     */
    private activeStack: Array<string>;

    /**
     * array of persistence sesssion
     */
    private persistentStack: Array<string>;

    /**
     * all sessions which exists
     */
    private sessionCache: Map<string, enigmaJS.IGeneratedAPI>;

    /**
     * max sessions we could open by default this is 5
     * set to value lte 0 for max sessions
     */
    private maxSessionCount = 5;

    /**
     * connection queue to handle action connections, we could not open same app / global context
     * twice. If an connection is allready runnig save it into connection queue and get it from here
     */
    private connectionQueue: Map<string, Promise<enigmaJS.IGeneratedAPI>>;

    private requestHooks: Array<() => WebSocket.ClientOptions> = [];

    private docCache: WeakMap<EngineAPI.IGlobal, EngineAPI.IApp> = new WeakMap();

    /**
     * Creates an instance of EnigmaSession.
     */
    public constructor(
        private connection: ConnectionModel
    ) {
        this.activeStack     = [];
        this.persistentStack = [];
        this.connectionQueue = new Map();
        this.sessionCache    = new Map();
    }

    public set maxSessions(max: number) {
        this.maxSessionCount = max;
    }

    public get maxSessions(): number {
        return this.maxSessionCount;
    }

    public beforeWebsocketCreate(hook: () => WebSocket.ClientOptions): void {
        this.requestHooks.push(hook);
    }

    public destroy(): void {
        this.sessionCache.forEach((session) => session.session.close());
        this.sessionCache.clear();
        this.requestHooks = [];
    }

    /**
     * opens a new session
     *
     * @param {string} [id=EnigmaSession.GLOBAL_SESSION_KEY]
     * @param {boolean} [keepAlive=false]
     * @param {string} [cacheKey]
     * @returns {(Promise<EngineAPI.IGlobal | undefined>)}
     * @memberof EnigmaSession
     */
    public async open(id = EnigmaSession.GLOBAL_SESSION_KEY, keepAlive = false, cacheKey?: string): Promise<EngineAPI.IGlobal | undefined>
    {
        let session: enigmaJS.IGeneratedAPI;
        /** create new session */
        if (!this.isCached(cacheKey ?? id)) {
            session = await this.createSessionObject(id, keepAlive, cacheKey);
        } else {
            session = await this.activateSession(cacheKey ?? id);
        }
        return session as EngineAPI.IGlobal;
    }

    /**
     * open document
     */
    public async openDoc(name: string): Promise<EngineAPI.IApp | undefined> {
        const logger = container.resolve(VsQlikLoggerConnection);
        /**
         * get session from cache or create new one
         */
        const global = await this.open(name);
        if (global) {
            if (!this.docCache.has(global)) {
                const app = await global.openDoc(name);
                // global.getActiveDoc();
                this.docCache.set(global, app);
                logger.debug(`open new app for ${name} and cached it to docCache`);
            }
            logger.debug(`return app ${name} from doc cache`);
            return this.docCache.get(global);
        }
    }

    /**
     * open a random session which could not be found anymore
     *
     * @param {boolean} [keepAlive=false]
     * @returns {(Promise<EngineAPI.IGlobal | undefined>)}
     * @memberof EnigmaSession
     */
    public async createSession(keepAlive = false): Promise<EngineAPI.IGlobal | undefined>
    {
        let id = '';
        do {
            id = Math.random().toString(32).substr(2);
        } while(this.sessionCache.has(id));
        return this.open(EnigmaSession.GLOBAL_SESSION_KEY, keepAlive, id);
    }

    /**
     * close an existing session
     *
     * @param {string} [appId]
     * @returns {Promise<void>}
     * @memberof EnigmaSession
     */
    public async close(key?: string): Promise<void> {
        const cacheKey = key || EnigmaSession.GLOBAL_SESSION_KEY;
        if (this.isCached(cacheKey)) {
            const global = this.loadFromCache(cacheKey) as EngineAPI.IGlobal;
            global.session.close();
            this.docCache.delete(global);
        }
    }

    /**
     * activate session if not allready in active stack
     */
    private async activateSession(id: string): Promise<enigmaJS.IGeneratedAPI>
    {
        const connection = this.loadFromCache(id);
        if (connection && !this.isActive(id)) {
            await this.suspendOldestSession();
            await connection.session.resume();
            this.activeStack.push(id);
        }
        return connection;
    }

    /**
     * create new session object, buffer current connections into map
     * so if same connection wants to open twice take existing Promise
     * and return this one.
     *
     * @todo refactor this one
     */
    private async createSessionObject(id: string, keepAlive = false, cacheId?: string): Promise<enigmaJS.IGeneratedAPI>
    {
        const cacheKey = cacheId ?? id;

        if (!this.connectionQueue.has(cacheKey)) {
            this.connectionQueue.set(cacheKey, this.resolveSession(id, keepAlive, cacheKey));
        }
        return this.connectionQueue.get(cacheKey) as Promise<enigmaJS.IGeneratedAPI>;
    }

    private async resolveSession(id: string, keepAlive, cacheKey: string): Promise<enigmaJS.IGeneratedAPI> {
        await this.suspendOldestSession();

        const session = await this.openSession(id);

        if (session) {
            /** @todo remove this memory leak since we open multiple global sessions we just want to throw away */
            if (id !== EnigmaSession.GLOBAL_SESSION_KEY) {
                session.on("closed", () => this.removeSessionFromCache(id));
            }
            this.sessionCache.set(cacheKey, session);
            this.connectionQueue.delete(cacheKey);

            keepAlive ? this.persistentStack.push(id) : this.activeStack.push(id);
            return session;
        }

        throw new Error(`could not open session for: ${id}`);
    }

    private async openSession(id = EnigmaSession.GLOBAL_SESSION_KEY): Promise<enigmaJS.IGeneratedAPI | undefined> {
        const session = ConnectionHelper.createEnigmaSession(this.connection, id);
        return session.open();
    }

    /**
     *
     */
    private removeSessionFromCache(id) {
        this.isCached(id) ? this.sessionCache.delete(id) : void 0;
        this.isActive(id) ? this.activeStack.splice(this.activeStack.indexOf(id), 1) : void 0;
    }

    /**
     * returns true if session is allready active
     */
    private isActive(id: string): boolean
    {
        return this.activeStack.indexOf(id) > -1 || this.persistentStack.indexOf(id) > -1;
    }

    /**
     * returns true if session is allready cached
     */
    private isCached(id: string): boolean
    {
        return this.sessionCache.has(id);
    }

    /**
     * load session object from cache
     */
    private loadFromCache(id = EnigmaSession.GLOBAL_SESSION_KEY): enigmaJS.IGeneratedAPI
    {
        const session = this.sessionCache.get(id);
        if (session) {
            return session;
        }
        throw "Session not found";
    }

    /**
     * suspend oldest session
     */
    private async suspendOldestSession(): Promise<void>
    {
        if (this.maxSessions <= 0 || this.activeStack.length < this.maxSessions) {
            return;
        }

        const oldestSessionId = this.activeStack.shift();
        const connection      = this.loadFromCache(oldestSessionId);

        if (connection) {
            await connection.session.suspend();
        }
    }
}
