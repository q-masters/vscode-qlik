import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixFsDirectoryAdapter } from "../data/entry";
import { WorkspaceFolderRegistry } from "projects/extension/workspace/utils";

@injectable()
export class ScriptDirectory extends QixFsDirectoryAdapter{

    public constructor(
        @inject(WorkspaceFolderRegistry) workspaceFolderRegistry: WorkspaceFolderRegistry
    ) {
        super(workspaceFolderRegistry);
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
}
