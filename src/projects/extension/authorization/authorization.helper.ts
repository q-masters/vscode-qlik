import { singleton, inject } from "tsyringe";
import { ExtensionContext } from "vscode";
import { FileStorage, MemoryStorage, Storage } from "@shared/storage";
import { ExtensionContext as ExtensionContextToken, VsQlikDevSettings } from "@data/tokens";
import { AuthorizationService } from "./utils/authorization.service";

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
}
