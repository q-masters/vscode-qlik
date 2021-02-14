import { ExtensionContext } from "@data/tokens";
import * as vscode from "vscode";
import { inject, singleton, container } from "tsyringe";
import { FileStorage, MemoryStorage, Storage } from "@core/storage";
import { SessionStorage } from "./api";
import { AuthorizationService } from "./utils/authorization.service";
import { ConnectionSetting } from "../connection/api";

/**
 * Authorization Module
 *
 */
@singleton()
export class AuthorizationModule {

    private authService: AuthorizationService;

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext
    ) {}

    /**
     * bootstrap connection module
     *
     */
    public bootstrap(): void {
        this.registerCommands();
        this.registerSessionStorage();
    }

    /**
     *
     *
     */
    public initialize(): void {
        this.authService = container.resolve(AuthorizationService);
    }

    /**
     * register commands for vscode
     *
     */
    private registerCommands(): void {

        const disposeables = [
            /** @todo implement user is authorized */
            vscode.commands.registerCommand('vsqlik:auth.authorized', () => void 0),
            /** get current session */
            vscode.commands.registerCommand('vsqlik:auth.session', (settings: ConnectionSetting) => this.authService.resolveSession(settings)),
            /** login */
            vscode.commands.registerCommand('vsqlik:auth.login', (settings: ConnectionSetting, uri?: string) =>  this.authService.login(settings, uri)),
            /** @todo implement logout */
            vscode.commands.registerCommand('vsqlik:auth.logout', () => void 0)
        ];

        this.extensionContext.subscriptions.push(...disposeables);
    }

    /**
     * register workspace folder events to get notified about our active connections
     *
     */
    private registerSessionStorage() {

        const settings: any = vscode.workspace.getConfiguration().get('VsQlik.Developer');
        const storage: Storage = settings.cacheSession
            ? new FileStorage(this.extensionContext.globalStoragePath, "auth.json")
            : new MemoryStorage();

        /** register connection storage */
        container.register(SessionStorage, {useValue: storage});
    }
}
