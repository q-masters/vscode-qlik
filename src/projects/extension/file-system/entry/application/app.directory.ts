import * as vscode from "vscode";
import { inject } from "tsyringe";
import { posix } from "path";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";

/** */
export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
    ) {
        super();
    }

    /**
     * read directory
     */
    public readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {

        const folders: [string, vscode.FileType][]  = [];
        const connection = this.getConnection(uri);

        if (connection) {
            const settings = connection.serverSettings.display;
            Object.keys(settings).forEach((key) => {
                if (settings[key] !== false) {
                    folders.push([key, vscode.FileType.Directory]);
                }
            });
        }
        return folders;
    }

    /**
     * get current stats of application
     */
    async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        const connection = this.getConnection(uri);
        const exists = connection?.fileSystemStorage.exists(uri);

        if (!exists) {
            console.log(uri);
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
            const connection = this.getConnection(uri);
            const app        = connection?.fileSystemStorage.read(uri.toString(true));

            if (connection && app) {
                await this.appService.renameApp(connection, app, posix.basename(newUri.path));
                connection.fileSystemStorage.rename(uri, newUri);
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
