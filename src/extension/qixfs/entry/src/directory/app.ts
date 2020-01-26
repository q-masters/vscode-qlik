import * as vscode from "vscode";
import { QixFsDirectory } from "../entry";
import { RouteParam } from "../../../utils";

export class AppDirectory extends QixFsDirectory {

    createDirectory(uri: vscode.Uri, name: string, params: RouteParam): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    public async delete(uri: vscode.Uri, name: string, params: RouteParam): Promise<void> {
        throw new Error("Method not implemented.");
    }

    readDirectory(uri: vscode.Uri, params: RouteParam): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            ['measures', vscode.FileType.Directory]
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

    rename(uri: vscode.Uri, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
