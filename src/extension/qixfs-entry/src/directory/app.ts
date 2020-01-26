import { QixFsDirectory } from "../entry";
import * as vscode from "vscode";
import { RouteParam } from "@qixfs/utils/router";

export class AppDirectory extends QixFsDirectory {

    readDirectory(uri: vscode.Uri, params: RouteParam): Thenable<[string, vscode.FileType][]> {
        throw new Error("Method not implemented.");
    }

    createDirectory(uri: vscode.Uri, name: string, params: RouteParam): Thenable<void> {
        throw new Error("Method not implemented.");
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

    delete(uri: vscode.Uri, params: RouteParam, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    rename(uri: vscode.Uri, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
