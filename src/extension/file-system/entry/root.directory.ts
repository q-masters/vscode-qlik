import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixDocumentProvider } from "@core/qix/documents";
import { QixFsDirectoryAdapter } from "../entry";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils";

@injectable()
export class QixFsRootDirectory extends QixFsDirectoryAdapter{

    public constructor(
        workspaceFolderRegistry: WorkspaceFolderRegistry,
        @inject(QixDocumentProvider) private documentProvider: QixDocumentProvider
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

    public readDirectory() {
        return [];
    }
}
