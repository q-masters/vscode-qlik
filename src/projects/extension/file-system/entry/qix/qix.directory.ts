import * as vscode from "vscode";
import { QixFsDirectoryAdapter, Entry } from "../../data";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";
import path from "path";
import { Connection } from "projects/extension/connection/utils/connection";

export interface DirectoryItem<T> {
    name: string,
    id: string,
    data: T
}

export interface DirectoryEntry {
    entry: Entry,
    item: [string, vscode.FileType]
}

export abstract class QixDirectory<T> extends QixFsDirectoryAdapter {

    /**
     * load data from qix
     */
    protected abstract loadData(uri: vscode.Uri): Promise<DirectoryItem<T>[]>;

    /**
     * build entry list
     */
    protected abstract generateEntry(data: DirectoryItem<T>, connection: Connection, uri: vscode.Uri): FilesystemEntry;

    /**
     * static library which allways exists
     */
    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.Directory
        };
    }

    /**
     * read variable directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<any> {
        const connection = await this.getConnection(uri);

        if (!connection) {
            throw vscode.FileSystemError.NoPermissions();
        }

        let data = await this.loadData(uri);
        data = this.sanitizeItemNames(data ?? []);
        return this.buildEntryList(data, uri);
    }

    /**
     * create directory list
     */
    protected async buildEntryList(data: DirectoryItem<T>[], uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        const connection = await this.getConnection(uri);

        if (!connection) {
            return [];
        }

        return data.map((item) => {
            const entry = this.generateEntry(item, connection, uri);
            const entryUri   = uri.with({path: path.posix.resolve(uri.path, `${entry.name}`)});
            connection?.fileSystem.write(entryUri.toString(true), entry);
            return [entry.name, entry.fileType ?? vscode.FileType.Directory];
        });
    }

    /**
     * ensure we dont have duplicated file / directory names
     */
    private sanitizeItemNames(items: DirectoryItem<T>[]): DirectoryItem<T>[] {
        const result: DirectoryItem<T>[] = [];
        const documentCache: Map<string, DirectoryItem<T>[]> = new Map();

        /** first loop to identify duplicated apps */
        items.forEach((entry) => {
            ! documentCache.has(entry.name)
                ? documentCache.set(entry.name, [entry])
                : documentCache.get(entry.name)?.push(entry);
        });

        const data = Array.from(documentCache.entries());

        /** second loop create names */
        for (let i = 0, ln = data.length; i < ln; i++) {
            const [name, entries] = data[i];
            for (let j = 0, appLn = entries.length; j < appLn; j++) {
                const entry = entries[j];
                const eName = entries.length > 1 ? `${name}.${entry.id.substr(0, 9)}` : name;
                result.push(Object.assign(entry, {name: eName}));
            }
        }
        return result;
    }
}
