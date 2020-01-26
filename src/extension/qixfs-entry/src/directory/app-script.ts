import { QixFsDirectory } from "../entry";
import * as vscode from "vscode";

export class AppScriptDirectory extends QixFsDirectory {
    readDirectory(uri: vscode.Uri, params: import("../../../qixfs").RouteParam): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
        throw new Error("Method not implemented.");
    }

    createDirectory(uri: vscode.Uri, name: string, params: import("../../../qixfs").RouteParam): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    stat(uri: vscode.Uri, params?: import("../../../qixfs").RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw new Error("Method not implemented.");
    }

    delete(uri: vscode.Uri, params: import("../../../qixfs").RouteParam, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    rename(uri: vscode.Uri, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
