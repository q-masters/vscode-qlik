import * as vscode from "vscode";
import { inject } from "tsyringe";
import { posix } from "path";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { FileSystemHelper } from "../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "./qixfs-entry";

export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
        @inject(FileSystemHelper) private fsHelper: FileSystemHelper,
        @inject(CacheRegistry) private cacheRegistry: CacheRegistry<WorkspaceFolder>
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
        /**
         * check application exists, we take this value from cache
         * so we dont need to call the qix engine for that since this
         * would be called very often (rename 3x, open 1x, ...)
         *
         * for example rename a application will trigger this 3 times:
         *
         * 1. 1st call folder we want to rename exists
         * 2. 2nd call new folder name dont exists
         * 3. do the rename
         * 4. 3rd call rename was successfully and exists now
         */
        const exists = this.fsHelper.exists(uri);

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

    /**
     * rename appliction
     */
    async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        try {
            const connection = await this.getConnection(uri);
            const app_id     = this.fsHelper.resolveAppId(uri);
            const workspace  = this.fsHelper.resolveWorkspace(uri);

            if (connection && app_id && workspace) {
                await this.appService.renameApp(connection, app_id, posix.basename(newUri.path));
                this.fsHelper.renameDirectory(uri, newUri);
            }

        } catch (error) {
            console.error(error);
        }
    }
}
