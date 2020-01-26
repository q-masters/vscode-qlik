import * as vscode from "vscode";
import { QixRouter } from "./router";
import { QixFsDirectory } from "@qixfs-entry";
import { posix } from "path";


// der brauch ne Map -> URI -> Connection

/** should use enum for this ? */
export namespace QixFsCommands {
    export const DELETE_FILE_COMMAND = `vscodeQlik.qixfs.deleteFileCommand`;
}

/** 
 * Qix File System
 * 
 * soll das immer mit enigma arbeiten ?
 */
export class QixFSProvider implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    /**
     * construct new Qix file system
     */
    public constructor() {
        this.emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile = this.emitter.event;
    }

    watch(_resource: vscode.Uri): vscode.Disposable {
        return new vscode.Disposable(() => {});
    }

    /**
     * return file or directory stats
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        /** find entry */
        const route = QixRouter.find(uri);
        if(route?.entry) {
            /** get current enigma session ? */
            return route.entry.stat(uri, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const route = QixRouter.find(uri);
        if (route?.entry.type === vscode.FileType.Directory) {
            return (route.entry as QixFsDirectory).readDirectory(uri, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async createDirectory(uri: vscode.Uri, silent = false): Promise<void> {
        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const name      = posix.basename(uri.path);

        const route = QixRouter.find(parentUri);
        if (route?.entry.type === vscode.FileType.Directory) {
            return await (route.entry as QixFsDirectory).createDirectory(uri, name, route.params);
        }

        throw vscode.FileSystemError.FileNotADirectory();
    }

    async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        throw vscode.FileSystemError.FileNotFound();
    }

    async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
    }

    async delete(uri: vscode.Uri): Promise<void> {
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
    }
}
