import * as vscode from "vscode";
import { inject } from "tsyringe";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { QixFsDirectoryAdapter } from "../data/entry";
import { FileSystemHelper } from "../utils/file-system.helper";
import { ApplicationCache } from "../data/cache";

export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
        @inject(CacheRegistry) private fileCache: CacheRegistry,
        @inject(FileSystemHelper) private fsHelper: FileSystemHelper,
    ) {
        super();
    }

    /**
     * read directory
     */
    public readDirectory(): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            ['variables', vscode.FileType.Directory],
            ['sheets', vscode.FileType.Directory]
        ];
    }

    /**
     * get current stats of application
     */
    async stat(uri: vscode.Uri): Promise<vscode.FileStat> {

        const exists = this.fileCache.exists(ApplicationCache, uri.toString());

        if (!exists) {
            throw vscode.FileSystemError.FileNotFound();
        }

        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        /*
        const workspace = this.fsHelper.resolveWorkspace(uri);
        const app_id    = this.fsHelper.resolveAppId(uri);

        try {
            if (connection && app_id) {
                await this.appService.renameApp(connection, app_id, posix.basename(newUri.path));
                this.fileCache.add(ApplicationCache, newUri.toString(), app_id);
                this.fileCache.delete(ApplicationCache, uri.toString());
            }
        } catch (error) {
            console.error(error);
        }
        */
    }
}
