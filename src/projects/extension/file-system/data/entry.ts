import * as vscode from "vscode";
import { container } from "tsyringe";
import { AuthStrategy } from "projects/shared/authorization/api";
import { AuthorizationService } from "projects/shared/authorization/utils/authorization.service";
import { AuthorizationStrategyConstructor } from "projects/shared/authorization/strategies/authorization.strategy";
import { EnigmaSession } from "projects/shared/connection";
import { RouteParam } from "projects/shared/router";
import { WorkspaceFolderRegistry } from "../../workspace";
import { ExtensionContext } from "projects/extension/data/tokens";
import { WorkspaceFolder } from "projects/extension/workspace/data/workspace-folder";

export interface QixFsEntryConstructor {
    new(): QixFsEntry;
}

/**
 * der würde nun mehrfach existieren
 * aber quasi als singleton
 *
 * er sucht sich immer die passende connection raus und leitet diese
 * an die eigentliche methode weiter
 */
export abstract class QixFsEntry {

    public readonly type: vscode.FileType;

    public isTemporary = false;

    private authService: AuthorizationService;

    private extensionContext: vscode.ExtensionContext;

    public constructor(
        protected workspaceFolderRegistry: WorkspaceFolderRegistry
    ) {
        this.authService      = container.resolve(AuthorizationService);
        this.extensionContext = container.resolve(ExtensionContext);
    }

    /**
     * delete a file or directory
     */
    abstract delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void>;

    /**
     * rename a file / directory
     */
    abstract rename(uri: vscode.Uri, name: string, params?: RouteParam): Promise<void> | void;

    /**
     * get file / directory stats
     */
    abstract stat(uri: vscode.Uri, params?: RouteParam ): vscode.FileStat | Thenable<vscode.FileStat>;

    protected async getConnection(uri: vscode.Uri): Promise<EnigmaSession> {
        const workspaceFolder = this.workspaceFolderRegistry.resolveByUri(uri);

        /**
         * if we are not connected to server enable connection
         */
        if (workspaceFolder) {

            if (!workspaceFolder.isConnected) {
                await this.establishConnection(workspaceFolder);
            }

            return workspaceFolder.connection;
        }

        throw new Error("not found");
    }

    /**
     * open an existing app
     * @todo move to enigma session provider ?
     */
    protected async openApp(workspaceUri: vscode.Uri, id: string): Promise<EngineAPI.IApp | undefined> {
        const connection = await this.getConnection(workspaceUri);
        const session    = await connection.open(id);
        return session?.openDoc(id);
    }

    /**
     * extract app id from file path
     */
    protected extractAppId(app: string): string {
        return app.split(/\n/)[1];
    }

    /**
     * if we are not connected to server currently
     * we have to do this now
     */
    private async establishConnection(folder: WorkspaceFolder): Promise<void> {

        const settings = folder.settings.connection;
        let strategyConstructor;

        switch (settings.authorization.strategy) {
            case AuthStrategy.FORM:
                strategyConstructor = await (await import("../../authorization/form-strategy")).default as AuthorizationStrategyConstructor;
                break;

            case AuthStrategy.CERTIFICATE:
                break;

            case AuthStrategy.CUSTOM:
                break;
        }

        try {
            const result = await this.authService.authorize(new strategyConstructor(settings));

            if (result.success) {
                folder.isConnected = true;
                folder.connection = new EnigmaSession({
                    ...settings,
                    cookies: result.cookies,
                });
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

/**
 * QixFs File Entry
 */
export abstract class QixFsFile extends QixFsEntry {

    public readonly type = vscode.FileType.File;

    abstract readFile(uri: vscode.Uri, params: RouteParam): Uint8Array | Thenable<Uint8Array>;

    abstract writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): void | Thenable<void>;
}

/**
 * QixFs Directory Entry
 */
export abstract class QixFsDirectory extends QixFsEntry {

    public readonly type = vscode.FileType.Directory;

    abstract readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]>;

    abstract createDirectory(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async createFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        throw Error("Could not create a new file");
    }
}

/**
 * QixFsFileAdater which only predefines all methods so we dont have to implement them
 * all. By default all Opertations are forbidden you have to implement a concrete file class
 * and override these methods.
 */
export class QixFsFileAdapter extends QixFsFile {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readFile(uri: vscode.Uri, params: RouteParam): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw vscode.FileSystemError.NoPermissions();
    }
}

/**
 * QixFsDirectoryAdapter which only predefines all methods so we dont have to implement them
 * all. By default all Opertations are forbidden you have to implement a concrete directory class
 * and override these methods.
 */
export class QixFsDirectoryAdapter extends QixFsDirectory {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDirectory(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw vscode.FileSystemError.NoPermissions();
    }
}
