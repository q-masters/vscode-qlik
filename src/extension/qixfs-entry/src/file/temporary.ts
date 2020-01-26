import { QixFsFile, QixFsDirectory } from "../entry";
import * as vscode from "vscode";
import { RouteParam, QixRouter } from "@qixfs/utils/router";
import { posix } from "path";

/**
 * creates a temporary file and delegate a create file request
 * to specific entry point
 */
export class TemporaryFile extends QixFsFile {

    public isTemporary = true;

    /**
     * if a file should be written we delegate the request to parent directory with
     * create file
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const route = QixRouter.find(parentUri);

        // delegate to parent route and execute createFile on it
        if (route?.entry && route.entry.type === vscode.FileType.Directory) {
            await (route.entry as QixFsDirectory).createFile(uri, content, route.params);
        }
    }

    public async stat(uri: vscode.Uri, params: RouteParam): Promise<vscode.FileStat> {
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * by default this should be a directory operation only in my opinion
     */
    public rename(connection: any, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {
        throw new Error("could not read file");
    }
}