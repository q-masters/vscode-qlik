import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { DataNode } from "@core/qix/utils/qix-list.provider";
import { ConnectionProvider } from "@core/public.api";
import path from "path";
import { EntryType } from "@vsqlik/fs/data";

@injectable()
export class ScriptDirectory extends QixFsDirectoryAdapter{

    public constructor(
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
    ) {
        super();
    }

    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }

    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const connection = await this.getConnection(uri);
        if (connection) {
            const fileUri  = uri.with({path: path.posix.resolve(uri.path, `main.qvs`)});
            connection.fileSystem.write(fileUri.toString(true), {
                id: 'main.qvs',
                name: 'main',
                raw: {},
                type: EntryType.SCRIPT,
                readonly: false
            });
            return [["main.qvs", vscode.FileType.File]];
        }
        return [];
    }

    public async delete(uri: vscode.Uri, params: DataNode): Promise<void> {
        if (!this.fileSystemHelper.isTemporaryFileEntry(uri)) {
            return super.delete(uri, params);
        }
        this.fileSystemHelper.unregisterTemporaryFile(uri);
    }
}
