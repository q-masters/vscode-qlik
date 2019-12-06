import * as vscode from "vscode";
import { Directory } from "./directory";
import { pathToFileURL } from "url";
import { posix } from "path";

/** 
 * Qix File System
 */
export class QixFS implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    private rootDirectory: Directory;

    /**
     * construct new Qix file system
     * 
     * @param <QlikConnector>
     */
    public constructor() {
        this.emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile = this.emitter.event;
    }

    public set root(directory: Directory) {
        this.rootDirectory = directory;
    }

    watch(_resource: vscode.Uri): vscode.Disposable {
        return new vscode.Disposable(() => {});
    }

    /**
     * das muss was zurück geben ansonsten klappts nicht
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {

        if (this.isInBlackList(uri)) {
            throw vscode.FileSystemError.FileNotFound();
        }

        if (uri.path === "/") {
            return this.rootDirectory.stat;
        }

        const entry = this.rootDirectory.find(uri);
        if (entry) {
            return entry.stat;
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        if (this.isInBlackList(uri)) {
            throw vscode.FileSystemError.FileNotFound();
        }

        if (uri.path === "/") {
            return await this.rootDirectory.readDirectory();
        }

        let entry = this.rootDirectory.find(uri);
        if (entry instanceof Directory) {
            return await entry.readDirectory();
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async createDirectory(uri: vscode.Uri, silent = false): Promise<void> {
        throw new Error("parent not a directory");
    }

    async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        if (this.isInBlackList(uri)) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const entry = this.rootDirectory.find(parentUri);

        if (entry instanceof Directory) {
            const source = await entry.readFile();
            return source;
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    async writeFile(
        uri: vscode.Uri,
        content: Uint8Array,
        options: { create: boolean; overwrite: boolean; },
    ): Promise<void> {
        throw ("nö");
    }

    async delete(uri: vscode.Uri): Promise<void> {
        throw ("nö");
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw ("nö");
    }

    private isInBlackList(uri: vscode.Uri) {

        const blackList = ['.vscode', '.git', 'node_modules', 'pom.xml'];
        return blackList.some((ignored) => uri.path.indexOf(ignored) === 1);

    }
}
