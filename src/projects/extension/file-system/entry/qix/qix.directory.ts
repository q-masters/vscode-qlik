import * as vscode from "vscode";
import { QixFsDirectoryAdapter, Entry } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { map } from "rxjs/operators";
import { EnigmaSession } from "projects/extension/connection";
import { Observable } from "rxjs";

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
    protected abstract loadData(connection: EnigmaSession, uri: vscode.Uri): Observable<DirectoryItem<T>[]>;

    /**
     * build entry list
     */
    protected abstract generateEntry(data: DirectoryItem<T>, uri: vscode.Uri): DirectoryEntry;

    public constructor(
        protected fileSystemHelper: FileSystemHelper
    ) {
        super();
    }

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

        return this.loadData(connection, uri).pipe(
            map((data) => this.sanitizeItemNames(data)),
            map((data) => this.buildEntryList(data, uri)),
        ).toPromise();
    }

    /**
     * create directory list
     */
    protected buildEntryList(data: DirectoryItem<T>[], uri: vscode.Uri): [string, vscode.FileType][] {
        return data.map((item) => {
            const entry    = this.generateEntry(item, uri);
            const entryUri = this.fileSystemHelper.createEntryUri(uri, entry.item[0]);
            this.fileSystemHelper.cacheEntry(entryUri, entry.entry);
            return entry.item;
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
