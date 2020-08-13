import { singleton, inject } from "tsyringe";
import { ExtensionContext } from "vscode";
import { EnigmaSession } from "projects/extension/connection";
import { FileStorage, MemoryStorage, Storage } from "@shared/storage";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { WorkspaceSetting } from "@vsqlik/settings/api";
import { ExtensionContext as ExtensionContextToken, VsQlikDevSettings } from "@data/tokens";
import { AuthorizationService } from "./utils/authorization.service";
import { AuthorizationStrategyConstructor } from "./strategies/authorization.strategy";
import { AuthStrategy } from "./api";

@singleton()
export class AuthorizationHelper {

    private storage: Storage;

    /**
     * cache for active connections maybe we could allways return a promise for that
     */
    private connections: WeakMap<WorkspaceFolder, Promise<EnigmaSession|undefined>>;

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
     * try to authenticate on qlik
     */
    public async authenticate(workspaceFolder: WorkspaceFolder): Promise<EnigmaSession|undefined>
    {
        if ( this.isConnected(workspaceFolder)) {
            return this.connections.get(workspaceFolder);
        }
        /*
        const authorizationProcess = this.startAuthorization(workspaceFolder);
        this.connections.set(workspaceFolder, authorizationProcess);
        return authorizationProcess;
        */
    }

    /**
     * check authorization is currently running
     */
    private isConnected(workspaceFolder: WorkspaceFolder): boolean
    {
        return !!this.connections.has(workspaceFolder);
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
            settings.connection.port?.toString() ?? "",
            settings.connection.path ?? "",
            settings.label
        );
    }

    /**
     * get current authorization strategy constructor from settings
     */
    public static async resolveStrategy(strategy: AuthStrategy): Promise<AuthorizationStrategyConstructor|null>
    {
        switch (strategy) {

            case AuthStrategy.FORM:
                return (await import('./strategies/form')).default as unknown as AuthorizationStrategyConstructor;
                break;

            case AuthStrategy.NONE:
                return (await import('./no-authorization-strategy')).default as unknown as AuthorizationStrategyConstructor;
                break;

            case AuthStrategy.CUSTOM:
                break;
        }

        return null;
    }
}
