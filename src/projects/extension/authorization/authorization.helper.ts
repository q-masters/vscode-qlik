import { singleton, inject } from "tsyringe";
import { existsSync, writeFileSync, statSync, readFileSync, mkdirSync } from "fs";
import * as path from "path";
import { EOL } from "os";
import { ExtensionContext } from "vscode";
import { AuthorizationService, AuthStrategy, AuthorizationStrategyConstructor } from "@shared/authorization";
import { ConnectionSetting, EnigmaSession, ConnectionHelper } from "@shared/connection";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { ExtensionContext as ExtensionContextToken } from "@data/tokens";

interface AuthorizationResult {
    isLoggedIn: boolean;
    cookies?: any[];
    loginUrl?: string;
}

@singleton()
export class AuthorizationHelper {

    private connections: WeakMap<WorkspaceFolder, EnigmaSession>;

    public constructor(
        @inject(AuthorizationService) private authService: AuthorizationService,
        @inject(ExtensionContextToken) private extensionContext: ExtensionContext
    ) {
        this.connections = new WeakMap();
    }

    /**
     * returns true we have allready a running connection
     */
    public isConnected(workspace: WorkspaceFolder): boolean
    {
        return this.connections.has(workspace);
    }

    /**
     * try to authenticate on qlik
     */
    public async authenticate(workspaceFolder: WorkspaceFolder): Promise<EnigmaSession|undefined>
    {
        if (this.connections.has(workspaceFolder)) {
            return this.connections.get(workspaceFolder);
        }

        const settings = workspaceFolder.settings;
        const state = await this.resolveAuthenticationState(settings);
        const result = !state.isLoggedIn
            ? await this.authorize(settings.connection, state.loginUrl as string)
            : state;

        if (result.isLoggedIn) {
            /** update cache */
            this.updateCache(
                this.createKey(workspaceFolder.settings.connection),
                {cookies: result?.cookies ?? []}
            );

            /** create / save connection */
            const connection = new EnigmaSession({...workspaceFolder.settings.connection, cookies: result?.cookies ?? []});
            this.connections.set(workspaceFolder, connection);

            return connection;
        }
    }

    /**
     * check we have an active session running on qlik server, if we have send back our current cookies
     * if not return the loginUrl which will be passed to authorization strategy
     */
    private async resolveAuthenticationState(settings: WorkspaceSetting): Promise<AuthorizationResult>
    {
        const data = this.resolveCache(this.createKey(settings.connection));
        const cookies = data?.cookies ?? [];

        return new Promise((resolve) => {
            const session = ConnectionHelper.createSession({...settings.connection, cookies});
            session.on("traffic:received", (response) => {
                if (response.method === "OnAuthenticationInformation") {
                    /**
                     * remove all listeners so we dont have a memory leak
                     * method exists but not in typings so cast this one to any
                     */
                    (session as any).removeAllListeners();
                    session.close();

                    if (response.params.mustAuthenticate) {
                        this.deleteFromCache(this.createKey(settings.connection));
                        resolve({isLoggedIn: false, loginUrl: response.params.loginUri});
                    } else {
                        resolve({isLoggedIn: true, cookies });
                    }
                }
            });
            session.open();
        });
    }

    /**
     * create key for the cache this would be a combination
     * from host name, path and port since a connection could
     * be placed under multiple names and is not really unique
     */
    private createKey(settings: ConnectionSetting): string
    {
        return "".concat(
            settings.host,
            settings.path ?? "",
            settings.port?.toString() ?? ""
        );
    }

    /**
     * get cached data
     */
    private resolveCache(key?: string): any
    {
        const data = JSON.parse(readFileSync(this.storage).toString());
        return key ? data[key] : data;
    }

    /**
     * update cached data
     */
    private updateCache(key: string, patch: any)
    {
        const data = this.resolveCache();
        data[key] = data[key] ? patch : {...data[key] ?? {}, ...patch};
        writeFileSync(this.storage, JSON.stringify(data) + EOL, {encoding: "utf-8", flag: "w"});
    }

    /**
     * delete from cache
     */
    private deleteFromCache(key: string) {
        const data = this.resolveCache();

        if (data[key]) {
            delete data[key];
            writeFileSync(this.storage, JSON.stringify(data) + EOL, {encoding: "utf-8", flag: "w"});
        }
    }

    /**
     * get local storage file and create required directory and file if not exists
     */
    private get storage(): string
    {
        const storagePath = this.extensionContext.globalStoragePath;
        const file = path.resolve(storagePath, 'auth.json');

        if (!existsSync(storagePath)) {
            mkdirSync(storagePath);
        }

        if(!existsSync(file) || !statSync(file).isFile) {
            writeFileSync(file, JSON.stringify({}) + EOL, {encoding: "utf-8",  flag: "w"});
        }

        return file;
    }

    /**
     * authorize vs given authorization strategy
     */
    private async authorize(settings: ConnectionSetting, loginUrl: string): Promise<AuthorizationResult>
    {
        const strategy = await this.resolveAuthorizationStrategy(settings.authorization.strategy);

        if (!strategy) {
            return {isLoggedIn: false};
        }

        const result = await this.authService.authorize(new strategy(settings, loginUrl ?? ""));
        return result.success ? { isLoggedIn: true, cookies: result.cookies } : {isLoggedIn: false};
    }

    /**
     * get current authorization strategy constructor from settings
     */
    private async resolveAuthorizationStrategy(strategy: AuthStrategy): Promise<AuthorizationStrategyConstructor|undefined>
    {
        let strategyConstructor;

        switch (strategy) {
            case AuthStrategy.FORM:
                strategyConstructor = await (await import("./form-strategy")).default as AuthorizationStrategyConstructor;
                break;

            case AuthStrategy.CERTIFICATE:
                break;

            case AuthStrategy.CUSTOM:
                break;
        }

        return strategyConstructor;
    }
}
