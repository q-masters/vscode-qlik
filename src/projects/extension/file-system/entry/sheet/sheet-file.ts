import * as vscode from "vscode";
import { inject } from "tsyringe";
import { QixSheetProvider } from "@shared/qix/utils/sheet.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFsFileAdapter } from "../qix/qixfs-entry";

export class SheetFile extends QixFsFileAdapter {

    public constructor(
        @inject(QixSheetProvider) private sheetProvider: QixSheetProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry<WorkspaceFolder>
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
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);
        const sheet_id   = workspace ? this.fileCache.resolve<string>(workspace, uri.toString(true)) : void 0;

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
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);
        const sheet_id   = workspace ? this.fileCache.resolve<string>(workspace, uri.toString(true)) : void 0;

        if (sheet_id && app_id) {
            const data = this.fileSystemHelper.fileToJson(uri, content) as EngineAPI.IGenericObjectEntry;
            return await this.sheetProvider.writePropertyTree(connection, app_id, sheet_id, data);
        }

        throw new Error("something failed");
    }
}
