import * as vscode from "vscode";
import { inject } from "tsyringe";

import { QixSheetProvider } from "@shared/qix/utils/sheet.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";

import { QixFsFileAdapter } from "../data/entry";
import { FileSystemHelper } from "../utils/file-system.helper";
import { SheetCache } from "../data/cache";

export class SheetFile extends QixFsFileAdapter {

    public constructor(
        @inject(QixSheetProvider) private sheetProvider: QixSheetProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry
    ) {
        super();
    }

    public async stat(): Promise<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.File,
        };
    }

    /**
     * read full content from sheet file into given format
     */
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const sheet_id   = this.fileCache.resolve<string>(SheetCache, uri.toString());

        if (sheet_id && app_id) {
            const data = await this.sheetProvider.getPropertyTree(connection, app_id, sheet_id);
            return this.fileSystemHelper.renderFile(uri, data);
        }

        return Buffer.from("Could not read sheet");
    }

    /**
     * write file
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const sheet_id   = this.fileCache.resolve<string>(SheetCache, uri.toString());

        if (sheet_id && app_id) {
            const data = this.fileSystemHelper.fileToJson(uri, content) as EngineAPI.IGenericObjectEntry;
            return await this.sheetProvider.writePropertyTree(connection, app_id, sheet_id, data);
        }

        throw new Error("something failed");
    }
}
