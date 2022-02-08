import * as vscode from "vscode";
import { inject } from "tsyringe";
import { posix } from "path";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { DisplaySettings } from "@core/public.api";

/** */
export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
    ) {
        super();
    }

    private defaultDisplaySettings: DisplaySettings = {
        dimensions: true,
        measures: true,
        script: true,
        sheets: true,
        variables: true,
        visualization: true
    };

    /**
     * read directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {

        const folders: [string, vscode.FileType][]  = [];
        const connection = await this.getConnection(uri);

        if (connection) {

            const settings = {
                ...this.defaultDisplaySettings,
                ...connection.serverSettings.display ?? {},
            };

            /**
             * what if the settings simply not exists
             */
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
        const connection = await this.getConnection(uri);
        const exists = connection?.fileSystem.exists(uri.toString(true));

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
            const app        = connection?.fileSystem.read(uri.toString(true));

            if (connection && app) {
                await this.appService.renameApp(connection, app.id, posix.basename(newUri.path));
                connection.fileSystem.rename(uri, newUri);
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
