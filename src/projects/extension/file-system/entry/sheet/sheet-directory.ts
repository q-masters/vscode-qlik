import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixSheetProvider } from "@shared/qix/utils/sheet.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";

@injectable()
export class SheetDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixSheetProvider) private sheetProvider: QixSheetProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry<WorkspaceFolder>
    ) {
        super();
    }

    /**
     * read sheet directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);
        const sheets: [string, vscode.FileType.File][] = [];

        if (app_id && connection && workspace) {
            const sheetList = await this.sheetProvider.getSheets(connection, app_id);
            sheetList.forEach((sheet) => {
                const fileName = this.fileSystemHelper.createFileName(uri, sheet.qData.title);
                const fileUri  = this.fileSystemHelper.createEntryUri(uri, sheet.qData.title);

                sheets.push([fileName, vscode.FileType.File]);

                this.fileCache.add(workspace, fileUri.toString(true), sheet.qInfo.qId);
            });
        }

        return sheets;
    }

    public stat(): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        };
    }
}
