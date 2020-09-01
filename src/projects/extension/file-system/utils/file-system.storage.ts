import { MemoryStorage } from "@core/storage";
import path from "path";
import * as vscode from "vscode";
import { EntryType } from "../data";

export interface FilesystemEntry {
    id: string;
    name: string;
    raw: {[key: string]: any};
    readonly: boolean;
    type: EntryType;
    fileType?: vscode.FileType
}

export class FileSystemStorage extends MemoryStorage<FilesystemEntry> {

    /**
     * rename file or directory
     */
    public rename(source: vscode.Uri, target: vscode.Uri): void {

        const entries   = Object.keys(this.data);
        const sourceUri = source.toString(true);

        /** resolve relative path between both */
        for (const filePath of entries) {

            if (!filePath.startsWith(sourceUri)) {
                continue;
            }

            const relativePath = filePath.substr(sourceUri.length).replace(/^\//, '');
            const newEntryUri  = target.with({path: path.posix.resolve(target.path, relativePath)});
            const oldEntryUri  = source.with({path: path.posix.resolve(source.path, relativePath)});
            const data         = this.read(oldEntryUri.toString(true)) as FilesystemEntry;

            this.delete(oldEntryUri.toString(true));
            this.write(newEntryUri.toString(true), data);
        }
    }

    /**
     * delete a directory
     */
    public deleteDirectory(source: vscode.Uri): void {
        const keys = Object.keys(this.data);
        for (const filePath of keys) {
            if (!filePath.startsWith(source.toString(true))) {
                continue;
            }
            this.delete(filePath);
        }
    }

    /**
     * resolve entry data from cache
     *
     * @param {vscode.Uri} uri
     * @param {EntryType} type
     * @param {boolean} [goUp=true] if true traverse up in tree [default is true]
     * @returns {Entry}
     */
    public parent(uri: vscode.Uri, type: EntryType): FilesystemEntry|undefined {
        let entryPath = path.posix.dirname(uri.path);

        while(entryPath !== "/") {
            const entry = this.read(uri.with({path: entryPath}).toString(true));
            if (entry && entry.type === type) {
                return entry;
            }
            entryPath = path.posix.dirname(entryPath);
        }
    }
}
