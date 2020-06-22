import { singleton, inject } from "tsyringe";
import { ExtensionContext } from "vscode";
import { AuthorizationService, AuthStrategy, AuthorizationStrategyConstructor } from "@shared/authorization";
import { ConnectionSetting, EnigmaSession, ConnectionHelper } from "@shared/connection";
import { FileStorage, MemoryStorage, Storage } from "@shared/storage";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { ExtensionContext as ExtensionContextToken, VsQlikDevSettings } from "@data/tokens";

interface AuthorizationResult {
    isLoggedIn: boolean;
    cookies?: any[];
    loginUrl?: string;
}

@singleton()
export class AuthorizationHelper {

    private connections: WeakMap<WorkspaceFolder, EnigmaSession>;

    private storage: Storage;

    public constructor(
        @inject(AuthorizationService) private authService: AuthorizationService,
        @inject(ExtensionContextToken) private extensionContext: ExtensionContext,
        @inject(VsQlikDevSettings) devSettings: any
    ) {
        this.connections = new WeakMap();
        this.storage =  devSettings.cacheSession
            ? new FileStorage(this.extensionContext.globalStoragePath, "auth.json")
            : new MemoryStorage();
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
        const key      = this.createKey(settings);
        const state    = await this.resolveAuthenticationState(settings, key);
        const result = !state.isLoggedIn
            ? await this.authorize(settings.connection, state.loginUrl as string)
            : state;

        if (result.isLoggedIn) {
            /** update cache */
            this.storage.write(key, {cookies: result?.cookies ?? []});

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
    private async resolveAuthenticationState(settings: WorkspaceSetting, key: string): Promise<AuthorizationResult>
    {
        const data = this.storage.read(key);
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
                        this.storage.delete(key);
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
    private createKey(settings: WorkspaceSetting): string
    {
        return "".concat(
            settings.connection.host,
            settings.connection.path ?? "",
            settings.connection.port?.toString() ?? "",
            settings.label
        );
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
