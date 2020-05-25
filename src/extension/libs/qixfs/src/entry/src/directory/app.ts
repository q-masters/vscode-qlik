import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../entry";
import { RouteParam } from "../../../utils";
import { TemporayFileStorage } from "../../../utils/src/temporary-file-storage";

export class AppDirectory extends QixFsDirectoryAdapter {

    readDirectory(): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            ['variables', vscode.FileType.Directory],
            ['sheets', vscode.FileType.Directory]
        ];
    }

    async stat(uri: vscode.Uri, params: RouteParam | undefined): Promise<vscode.FileStat> {

        if (TemporayFileStorage.exists(uri)) {
            TemporayFileStorage.remove(uri);

            // trigger the rename
            setTimeout(async () => {
                vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
            }, 50);

            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 10,
                type: vscode.FileType.Directory
            };
        }

        if (params?.app && await this.appExists(uri, this.extractAppId(params.app))) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 10,
                type: vscode.FileType.Directory
            };
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    private async appExists(uri: vscode.Uri, app: string): Promise<boolean> {
        const connection = await this.getConnection(uri);
        return connection.isApp(app);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
        console.log("ich rename nun");
    }
}
