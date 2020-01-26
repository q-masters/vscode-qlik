import * as vscode from "vscode";
import { RouteParam } from "@qixfs/utils/router";
import { WorkspaceFolderManager } from "@qixfs/utils";
import { EnigmaSession } from "@extension/enigma";

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

    abstract rename(uri: vscode.Uri, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void>;

    abstract delete(uri: vscode.Uri, name: string, params: RouteParam): void | Thenable<void>;

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
