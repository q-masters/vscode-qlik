import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixFsDirectoryAdapter } from "./qixfs-entry";
import { FileSystemHelper } from "../utils/file-system.helper";

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

    public async readDirectory() {
        return [["main.qvs", vscode.FileType.File]];
    }

    public async delete(uri: vscode.Uri, name: string, params: any): Promise<void> {
        if (!this.fileSystemHelper.isTemporaryFileEntry(uri)) {
            return super.delete(uri, name, params);
        }
        this.fileSystemHelper.unregisterTemporaryFile(uri);
    }
}
