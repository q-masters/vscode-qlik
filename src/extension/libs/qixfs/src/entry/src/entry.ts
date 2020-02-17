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

    protected getConnection(uri: vscode.Uri): EnigmaSession {
        const workspaceFolder = WorkspaceFolderManager.resolveWorkspaceFolder(uri);
        if (workspaceFolder) {
            return workspaceFolder.connection;
        }
        throw new Error("not found");
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

    /**
     * read a directory
     */
    abstract readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]>;

    /**
     * create a new directory
     */
    abstract createDirectory(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void>;

    /**
     * create new file in directory
     */
    public async createFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
    }
}

/**
 * QixFsFileAdater which only predefines all methods so we dont have to implement them
 * all. By default all Opertations are forbidden you have to implement a concrete file class
 * and override these methods.
 */
export class QixFsFileAdapter extends QixFsFile {

    readFile(uri: vscode.Uri, params: RouteParam): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

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
    readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw vscode.FileSystemError.NoPermissions();
    }

    createDirectory(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
        throw vscode.FileSystemError.NoPermissions();
    }

    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw vscode.FileSystemError.NoPermissions();
    }
}
