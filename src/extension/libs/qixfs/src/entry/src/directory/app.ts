import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../entry";
import { RouteParam } from "../../../utils";

export class AppDirectory extends QixFsDirectoryAdapter {

    readDirectory(): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            ['variables', vscode.FileType.Directory]
        ];
    }

    async stat(uri: vscode.Uri, params: RouteParam | undefined): Promise<vscode.FileStat> {
        if (params?.app && await this.appExists(uri, params.app)) {
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
}
