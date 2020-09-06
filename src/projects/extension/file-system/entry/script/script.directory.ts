import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { DataNode } from "@core/qix/utils/qix-list.provider";

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

    public async readDirectory(): Promise<[string, vscode.FileType][]> {
        return [["main.qvs", vscode.FileType.File]];
    }

    public async delete(uri: vscode.Uri, params: DataNode): Promise<void> {
        if (!this.fileSystemHelper.isTemporaryFileEntry(uri)) {
            return super.delete(uri, params);
        }
        this.fileSystemHelper.unregisterTemporaryFile(uri);
    }
}
