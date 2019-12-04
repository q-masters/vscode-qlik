import * as vscode from "vscode";
import { posix } from "path";
import { QlikConnector } from "./connector";

/** 
 * script is a file
 * 
 */
export class File implements vscode.FileStat {

    type: vscode.FileType;

    ctime: number;

    mtime: number;

    size: number;

    data?: Uint8Array;

    name: string;

    public constructor(name: string) {
        this.type = vscode.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size  = 0;
        this.name = name;
    }
}

export class Directory implements vscode.FileStat {

    type: vscode.FileType;

    ctime: number;

    mtime: number;

    size: number;

    name: string;

    entries: Map<string, Directory | File>;

    dataSource: QlikConnector | undefined;

    public constructor(name: string) {
        this.type = vscode.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size  = 0;
        this.name = name;
        this.entries = new Map();
    }
}

/** 
 * Qix File System
 */
export class QixFS implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private root = new Directory('');

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    private sourceRoutes: Map<string, QlikConnector> = new Map();

    /**
     * construct new Qix file system
     * 
     * @param <QlikConnector>
     */
    public constructor() {
        this.emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile = this.emitter.event;
        this.root = new Directory('');
    }

    watch(_resource: vscode.Uri): vscode.Disposable {
        return new vscode.Disposable(() => { });
    }

    /**
     * das muss was zurück geben ansonsten klappts nicht
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        const child = this.find(uri);
        if (child) {
            return child;
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     */
    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][] | any> {

        /**
         * read out all apps from enigma
         */
        const result: [string, vscode.FileType][] = [];
        const directory = this.find(uri);

        if (!(directory instanceof Directory)) {
            return [];
        }

        const parsed = uri.path.match(/^\/([^\/]+)(?:\/(.*))?/);

        if (parsed && this.sourceRoutes.has(parsed[1])) {
            return this.sourceRoutes.get(parsed[1])?.exec(uri, this) ?? [];
        } else {
            directory.entries.forEach((entry) => {
                result.push([entry.name, entry.type]);
            })
        }

        return result;
    }

    /**
     * called if we create a new directory, could also happens through
     * context menu
     */
    createDirectory(uri: vscode.Uri): void {
        let rootPath = uri.with({ path: posix.dirname(uri.path) });
        const parent = this.find(rootPath);

        if (parent instanceof Directory) {
            const name = posix.basename(uri.path);
            parent.entries.set(name, new Directory(name));
            parent.mtime = Date.now();
            parent.size += 1;
            return;
        }

        throw new Error("parent not a directory");
    }

    public registerDataSource(name: string, connector: QlikConnector) {

        const parent = this.root;
        this.sourceRoutes.set(name, connector);

        let entry = new Directory(name);
        parent.entries.set(entry.name, entry);
        parent.mtime = Date.now();
        parent.size += 1;
    }

    private find(uri: vscode.Uri): Directory | File {

        const parts = uri.path.split("/").filter((part) => part.trim() !== "");
        let source: Directory = this.root;

        while (parts.length > 0) {
            const part = parts.shift() as string;
            const child = source.entries.get(part);

            switch(true) {
                case child instanceof Directory:
                    source = child as Directory;
                    continue;
                case child instanceof File:
                    return child as File;
                default:
                    throw vscode.FileSystemError.FileNotFound(uri);
            }
        }
        return source;
    }

    /**
     * read a file, checked in general for settings, tasks json files
     * and if file is open in editor.
     * 
     * Could cause Problems we have to open directory first allways
     * 
     * but it seems he checks first file contents
     */
    readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
        return Buffer.from("Hallo Qix File System", "utf8");
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean; }): void | Thenable<void> {
        console.log('write file');
    }

    delete(uri: vscode.Uri, options: { recursive: boolean; }): void | Thenable<void> {
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
    }
}