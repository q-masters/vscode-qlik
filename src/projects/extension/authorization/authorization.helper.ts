import { singleton, inject } from "tsyringe";
import { ExtensionContext } from "vscode";
import { FileStorage, MemoryStorage, Storage } from "@shared/storage";
import { ExtensionContext as ExtensionContextToken, VsQlikDevSettings } from "@data/tokens";
import { AuthorizationService } from "./utils/authorization.service";
import { AuthorizationStrategyConstructor } from "./strategies/authorization.strategy";
import { AuthStrategy } from "./api";

@singleton()
export class AuthorizationHelper {

    private storage: Storage;

    public constructor(
        @inject(AuthorizationService) private authService: AuthorizationService,
        @inject(ExtensionContextToken) private extensionContext: ExtensionContext,
        @inject(VsQlikDevSettings) devSettings: any
    ) {
        this.storage =  devSettings.cacheSession
            ? new FileStorage(this.extensionContext.globalStoragePath, "auth.json")
            : new MemoryStorage();
    }

    /**
     * get current authorization strategy constructor from settings
     */
    public static async resolveStrategy(strategy: AuthStrategy): Promise<AuthorizationStrategyConstructor|null>
    {
        switch (strategy) {

            case AuthStrategy.FORM:
                return await (await import('./strategies/form')).default as unknown as AuthorizationStrategyConstructor;

            case AuthStrategy.NONE:
                return await (await import('./no-authorization-strategy')).default as unknown as AuthorizationStrategyConstructor;

            case AuthStrategy.CUSTOM:
                return null;
                break;

            default:
                return null;
        }
    }
}
