import * as vscode from "vscode";
import { posix, resolve } from "path";
import { RouteParam, QixRouter } from "../../../utils";
import { QixFsDirectory, QixFsFile } from "../entry";

export class AppScriptDirectory extends QixFsDirectory {

    delete(uri: vscode.Uri, name: string, params?: RouteParam): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    readDirectory(uri: vscode.Uri, params?: RouteParam): [string, vscode.FileType][] {
        return [["main.qvs", vscode.FileType.File]];
    }

    /** 
     * create new file on app script directory
     * 
     * since there is only 1 File in this case main.qvs we could not create a new one and delegate the request
     * to writeFile
     */
    public async createFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        const fileUri   = uri.with({path: resolve(posix.dirname(uri.path), "main.qvs")})
        const route = QixRouter.find(fileUri);
        if (route?.entry && route.entry.type === vscode.FileType.File) {
            await (route.entry as QixFsFile).writeFile(fileUri, content, route.params);
        }
    }

    createDirectory(uri: vscode.Uri, name: string, params?: RouteParam): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        }
    }

    rename(uri: vscode.Uri, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
