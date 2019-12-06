import {FileType, FileStat, Uri, window, FileSystemError} from "vscode";

export class File {

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
}

export abstract class Directory {

    abstract find(path: Uri): Directory | File;

    abstract readFile(): Promise<Uint8Array>;

    abstract readDirectory(): Promise<[string, FileType][]>;

    protected entries: Map<string, Directory | File> = new Map();

    createFile(): void {
        window.showErrorMessage("Operation not permitted: create File");
        this.throwNoPermission();
    };

    writeFile(): void {
        window.showErrorMessage("Operation not permitted: write File");
        throw FileSystemError.NoPermissions();
    };

    createDirectory(): void {
        window.showErrorMessage("Operation not permitted: create Directory");
        throw FileSystemError.NoPermissions();
    };

    deleteDirectory(): void {
        window.showErrorMessage("Operation not permitted: delete Directory");
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

    private throwNoPermission() {
    }
}
