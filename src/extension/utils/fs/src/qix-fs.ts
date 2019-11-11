import * as vscode from "vscode";
import { posix } from "path";
import { QlikConnector } from "../../connector";

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

    public constructor(name: string) {
        this.type = vscode.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size  = 0;
        this.name = name;
        this.entries = new Map();
    }

    public async read(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const result: [string, vscode.FileType][] = [];
        this.entries.forEach((entry) => result.push([entry.name, entry.type]));
        return result;
    }
}

class QlikDirectory extends Directory {

    constructor(
        name: string, 
        private connector: QlikConnector
    ) {
        super(name);
    }

    public async read(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        const result: [string, vscode.FileType][] = [];

        /** will only works if this is a root directory */
        const appList = await this.connector.readAppList();

        appList.forEach((app) => {
            /** müsst vermutlich ein type zurück geben File oder Directory */
            result.push([app.name, vscode.FileType.Directory]);
            this.entries.set(app.name, new Directory(app.name));
        });

        /** 
         * in dem moment muss ich die verzeichnisse hinzufügen
         */

        return result;
    }
}


/** 
 * Qix File System
 */
export class QixFS implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private root = new Directory('');

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

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

    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        const source = this.findDirectoryByPath(uri.path);
        if (!(source instanceof Directory)) {
            throw vscode.FileSystemError.FileNotFound();
        }
        return source;
    }

    /**
     */
    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        /**
         * read out all apps from enigma
         */
        const result: [string, vscode.FileType][] = [];
        const directory = this.findDirectoryByPath(uri.path);

        if (directory instanceof Directory) {
            const data = await directory.read(uri);
            result.push(...data);
            console.log(result);
        }
        return result;
    }

    /**
     * called if we create a new directory, could also happens through
     * context menu
     */
    createDirectory(uri: vscode.Uri): void {

        const basename = posix.basename(uri.path);
        const dirname = uri.with({ path: posix.dirname(uri.path) });
        const parent = this.findDirectoryByPath(dirname.path);

        if (parent instanceof Directory) {
            let entry = new Directory(basename);
            parent.entries.set(entry.name, entry);
            parent.mtime = Date.now();
            parent.size += 1;
        }
    }

    /**
     * register new qlik root directory
     */
    public registerRoot(uri: vscode.Uri, connector: QlikConnector) {

        const parent = this.root;
        const basename = posix.basename(uri.path);

        let entry = new QlikDirectory(basename, connector);

        parent.entries.set(entry.name, entry);
        parent.mtime = Date.now();
        parent.size += 1;
    }

    private findDirectoryByPath(path: string): Directory | undefined {
        const parts = path.split("/").filter((part) => part.trim() !== "");
        let sourceDirectory: Directory | undefined  = this.root;

        while (parts.length) {
            const part = parts.shift() as string;

            // we should check this is a directory
            if (!sourceDirectory.entries.has(part)) {
                sourceDirectory = void 0;
                break;
            }
            sourceDirectory = sourceDirectory.entries.get(part) as Directory;
        }
        return sourceDirectory;
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