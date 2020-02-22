import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../entry";
import { RouteParam } from "../../../utils";

export class AppDirectory extends QixFsDirectoryAdapter {

    readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            /* ['variables', vscode.FileType.Directory] */
        ];
    }

    async stat(uri: vscode.Uri, params: RouteParam | undefined): Promise<vscode.FileStat> {
        if (params?.app && await this.getConnection(uri).isApp(params.app)) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 10,
                type: vscode.FileType.Directory
            };
        }
        throw vscode.FileSystemError.FileNotFound();
    }
}
