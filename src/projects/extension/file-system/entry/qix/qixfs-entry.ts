import * as vscode from "vscode";
import { container } from "tsyringe";
import { EnigmaSession } from "projects/extension/connection";
import { RouteParam } from "projects/shared/router";
import { AuthorizationHelper } from "projects/extension/authorization/authorization.helper";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";

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

    private authService: AuthorizationHelper;

    private workspaceFolderRegistry: WorkspaceFolderRegistry;

    public constructor() {
        this.authService             = container.resolve(AuthorizationHelper);
        this.workspaceFolderRegistry = container.resolve(WorkspaceFolderRegistry);
    }

    /**
     * delete a file or directory
     */
    abstract delete(uri: vscode.Uri, params: RouteParam): void | Thenable<void>;

    /**
     * rename a file / directory
     */
    abstract rename(uri: vscode.Uri, newUri: vscode.Uri, params?: RouteParam): Promise<void> | void;

    /**
     * get file / directory stats
     */
    abstract stat(uri: vscode.Uri, params?: RouteParam ): vscode.FileStat | Thenable<vscode.FileStat>;

    protected async getConnection(uri: vscode.Uri): Promise<EnigmaSession | undefined> {
        const workspaceFolder = this.workspaceFolderRegistry.resolveByUri(uri);
        if (workspaceFolder) {
            return await this.authService.authenticate(workspaceFolder);
        }
    }

    protected getWorkspace(uri: vscode.Uri): WorkspaceFolder | undefined {
        return this.workspaceFolderRegistry.resolveByUri(uri);
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
export abstract class QixFsFileAdapter extends QixFsFile {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readFile(uri: vscode.Uri, params: RouteParam): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    writeFile(uri: vscode.Uri, content: Uint8Array, params?: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(uri: vscode.Uri, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, name: vscode.Uri, params?: RouteParam | undefined): void | Promise<void> {
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
export abstract class QixFsDirectoryAdapter extends QixFsDirectory {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDirectory(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(uri: vscode.Uri, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, newUri: vscode.Uri, params?: RouteParam | undefined): void | Promise<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw vscode.FileSystemError.NoPermissions();
    }
}
