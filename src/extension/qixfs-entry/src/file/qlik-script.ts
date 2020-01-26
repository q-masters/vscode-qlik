import { QixFsFile } from "../entry";
import * as vscode from "vscode";

export class QlikScriptFile extends QixFsFile {
    readFile(uri: vscode.Uri, params: import("../../../qixfs").RouteParam): Uint8Array | Thenable<Uint8Array> {
        throw new Error("Method not implemented.");
    }

    writeFile(uri: vscode.Uri, content: Uint8Array, params: import("../../../qixfs").RouteParam): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    stat(uri: vscode.Uri, params?: import("../../../qixfs").RouteParam | undefined): vscode.FileStat | Thenable<vscode.FileStat> {
        throw new Error("Method not implemented.");
    }

    delete(uri: vscode.Uri, params: import("../../../qixfs").RouteParam, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    rename(connection: any, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
