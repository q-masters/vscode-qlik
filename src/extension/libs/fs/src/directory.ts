import {FileType, FileStat, Uri, window, FileSystemError} from "vscode";

export interface Entry {

    readonly stat: FileStat;

    destroy:() => Promise<void>;
}

export class File implements Entry {

    private fileData: Uint8Array = Buffer.from("");

    public constructor(data?: string | Uint8Array) {
        data ? this.content = data : void 0;
    }

    public set content(data: string | Uint8Array) {
        this.fileData = typeof data === "string" ? Buffer.from(data) : data;
    }

    public get stat(): FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: this.fileData.byteLength,
            type: FileType.File
        }
    }

    public destroy(): Promise<void> {
        return Promise.resolve();
    }
}

export abstract class Directory implements Entry {

    abstract find(path: Uri): Directory | File;

    abstract readFile(): Promise<Uint8Array>;

    abstract readDirectory(): Promise<[string, FileType][]>;

    abstract destroy(): Promise<void>;

    protected entries: Map<string, Directory | File> = new Map();

    createFile(name: string, content:Uint8Array): void {
        window.showErrorMessage(`Operation not permitted: create File ${name}`);
        throw FileSystemError.NoPermissions();
    };

    writeFile(): void {
        window.showErrorMessage("Operation not permitted: write File");
        throw FileSystemError.NoPermissions();
    };

    createDirectory(name: string): void | Thenable<void> {
        window.showErrorMessage("Operation not permitted: create Directory");
        throw FileSystemError.NoPermissions();
    };

    /**
     * Delete a file or directory
     *
     * @param name name of entry which should deleted
     * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist.
     * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
     */
    delete(name: string): Promise<void> {
        window.showErrorMessage(`Operation not permitted: delete ${name}`);
        throw FileSystemError.NoPermissions();
    };

    public get stat(): FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: this.entries.size,
            type: FileType.Directory
        }
    }
}
