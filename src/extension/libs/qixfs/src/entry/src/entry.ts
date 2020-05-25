import * as vscode from "vscode";
import { WorkspaceFolderManager, RouteParam } from "../../utils";
import { EnigmaSession } from "extension/libs/enigma";

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

    protected getConnection(uri: vscode.Uri): Promise<EnigmaSession> {
        const workspaceFolder = WorkspaceFolderManager.resolveWorkspaceFolder(uri);
        if (workspaceFolder) {
            return workspaceFolder.connection;
        }

        throw new Error("not found");
    }

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

    abstract delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void>;

    abstract rename(uri: vscode.Uri, name: string, params?: RouteParam): Promise<void> | void;

    abstract stat(uri: vscode.Uri, params?: RouteParam ): vscode.FileStat | Thenable<vscode.FileStat>;
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
