import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../data";
import { inject } from "tsyringe";
import { FileSystemHelper } from "../utils/file-system.helper";
import { map } from "rxjs/operators";
import { EnigmaSession } from "@core/connection";
import { Observable } from "rxjs";

export interface DirectoryItem<T> {
    name: string,
    id: string,
    data: T
}

export abstract class QixDirectory<T> extends QixFsDirectoryAdapter {

    /**
     * load data from qix
     */
    protected abstract loadData(connection: EnigmaSession, app: string): Observable<DirectoryItem<T>[]>;

    /**
     * build entry list
     */
    protected abstract buildEntryList(data: DirectoryItem<T>[], uri: vscode.Uri): [string, vscode.FileType][];

    public constructor(
        @inject(FileSystemHelper) protected fileSystemHelper: FileSystemHelper
    ) {
        super();
    }

    /**
     * read variable directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<any> {
        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);

        if (!connection || !app_id) {
            throw vscode.FileSystemError.NoPermissions();
        }

        return this.loadData(connection, app_id).pipe(
            map((data) => this.sanitizeItemNames(data)),
            map((data) => this.buildEntryList(data, uri))
        ).toPromise();
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
