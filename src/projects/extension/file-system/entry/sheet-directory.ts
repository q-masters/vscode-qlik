import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixSheetProvider } from "@shared/qix/utils/sheet.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { FileSystemHelper } from "../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "../data/entry";
import { SheetCache } from "../data/cache";
import { posix } from "path";

@injectable()
export class SheetDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixSheetProvider) private sheetProvider: QixSheetProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry
    ) {
        super();
    }

    /**
     * read sheet directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        const appId = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);
        const sheets: [string, vscode.FileType.File][] = [];

        if (appId && connection) {
            const sheetList = await this.sheetProvider.getSheets(connection, appId);
            sheetList.forEach((sheet) => {
                const fileUri  = this.fileSystemHelper.createFileUri(uri, sheet.qData.title);
                const fileName = posix.parse(fileUri.path).base;

                sheets.push([fileName, vscode.FileType.File]);
                this.fileCache.add(SheetCache, fileUri.toString(), sheet.qInfo.qId);
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
