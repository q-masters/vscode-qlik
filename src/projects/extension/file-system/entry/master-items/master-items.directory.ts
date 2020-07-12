import * as vscode from "vscode";
import { DirectoryList } from "../../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";

export class QixFsMasterItemsDirectory extends QixFsDirectoryAdapter {

    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 2,
            type: vscode.FileType.Directory
        };
    }

    public async readDirectory(): Promise<DirectoryList> {
        return [
            ["measures", vscode.FileType.Directory],
            ["dimensions", vscode.FileType.Directory]
        ];
    }
}
