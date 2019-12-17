import * as vscode from "vscode";
import { Directory } from "./directory";
import { posix } from "path";

/** should use enum for this ? */
export namespace QixFsCommands {
    export const DELETE_FILE_COMMAND = `vscodeQlik.qixfs.deleteFileCommand`;
}

/** 
 * Qix File System
 */
export class QixFS implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    private rootDirectory: Directory;

    private bufferedEvents: vscode.FileChangeEvent[] = [];
    private fireSoonHandle?: NodeJS.Timer;

    /**
     * construct new Qix file system
     * 
     * @param <QlikConnector>
     */
    public constructor() {
        this.emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile = this.emitter.event;
        this.registerCommands();
    }

    public set root(directory: Directory) {
        this.rootDirectory = directory;
    }

    watch(_resource: vscode.Uri): vscode.Disposable {
        return new vscode.Disposable(() => {
        });
    }

    /**
     * return file or directory stats
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        if (this.isInBlackList(uri)) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const entry = uri.path === "/" ? this.rootDirectory : this.rootDirectory.find(uri);
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
        const parent = posix.dirname(uri.path);
        const entry  = parent === "/" ? this.rootDirectory : this.rootDirectory.find(uri.with({path: parent}));
        if (entry instanceof Directory) {
            return await entry.readDirectory();
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async createDirectory(uri: vscode.Uri, silent = false): Promise<void> {

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const name      = posix.basename(uri.path);
        const entry     = parentUri.path === "/" ? this.rootDirectory : this.rootDirectory.find(parentUri);

        if (entry && entry instanceof Directory) {
            await entry.createDirectory(name);
            this.fireSoon({ type: vscode.FileChangeType.Changed, uri: parentUri}, { type: vscode.FileChangeType.Created, uri });
        }

        throw vscode.FileSystemError.FileNotADirectory();
    }

    async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        if (this.isInBlackList(uri)) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const entry = this.rootDirectory.find(parentUri);

        if (entry instanceof Directory) {
            const source = await entry.readFile(posix.basename(uri.path));
            return source;
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): Promise<void> {
        const file   = posix.basename(uri.path);
        const parent = posix.dirname(uri.path);
        const entry  = parent === "/" ? this.rootDirectory : this.rootDirectory.find(uri.with({path: parent}));

        if (entry instanceof Directory) {
            await entry.writeFile(file, content);
        }
    }

    async delete(uri: vscode.Uri): Promise<void> {
        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const toDelete  = posix.basename(uri.path);

        if (parentUri.path === "/") {
            return this.rootDirectory.delete(toDelete);
        }

        const entry = this.rootDirectory.find(parentUri);
        if (entry instanceof Directory) {
            entry.delete(toDelete);
        }

        this.fireSoon(
            {type: vscode.FileChangeType.Changed, uri: parentUri},
            {type: vscode.FileChangeType.Deleted, uri }
        );
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
    }

    private registerCommands() {
        vscode.commands.registerCommand(QixFsCommands.DELETE_FILE_COMMAND, uri => {
            this.delete(uri);
        });
    }

    private isInBlackList(uri: vscode.Uri) {
        const blackList = ['.vscode', '.git', 'node_modules', 'pom.xml'];
        return blackList.some((ignored) => uri.path.indexOf(ignored) === 1);
    }

    private fireSoon(...events: vscode.FileChangeEvent[]): void {
        this.bufferedEvents.push(...events);

        if (this.fireSoonHandle) {
            clearTimeout(this.fireSoonHandle);
        }

        this.fireSoonHandle = setTimeout(() => {
            this.emitter.fire(this.bufferedEvents);
            this.bufferedEvents.length = 0;
        }, 5);
    }
}
