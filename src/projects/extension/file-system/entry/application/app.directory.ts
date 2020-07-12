import * as vscode from "vscode";
import { inject } from "tsyringe";
import { posix } from "path";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";

/** */
export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
        @inject(FileSystemHelper) private fsHelper: FileSystemHelper,
    ) {
        super();
    }

    /**
     * read directory
     */
    public readDirectory(): [string, vscode.FileType][] {
        return [
            ['master-items', vscode.FileType.Directory],
            ['script', vscode.FileType.Directory],
            ['sheets', vscode.FileType.Directory],
            ['variables', vscode.FileType.Directory],
        ];
    }

    /**
     * get current stats of application
     */
    async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        const exists = this.fsHelper.exists(uri);

        if (!exists) {
            throw vscode.FileSystemError.FileNotFound();
        }

        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        };
    }

    /**
     * rename appliction
     */
    async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        try {
            const connection = await this.getConnection(uri);
            const app        = this.fsHelper.resolveAppId(uri);
            const workspace  = this.fsHelper.resolveWorkspace(uri);

            if (connection && app && workspace) {
                await this.appService.renameApp(connection, app, posix.basename(newUri.path));
                this.fsHelper.renameDirectory(uri, newUri);
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
