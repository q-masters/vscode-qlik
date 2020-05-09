import * as vscode from "vscode";
import { QixRouter } from "../../../utils";
import { QixFsDirectory, QixFsFileAdapter } from "../entry";
import { posix } from "path";

/**
 * creates a temporary file and delegate a create file request
 * to specific entry point
 */
export class TemporaryFile extends QixFsFileAdapter {

    public isTemporary = true;

    /**
     * if a file should be written we delegate the request to parent directory with
     * create file
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const route = QixRouter.find(parentUri);

        // delegate to parent route and execute createFile on it
        if (route?.entry.type === vscode.FileType.Directory) {
            await (route.entry as QixFsDirectory).createFile(uri, content, route.params);
        }
    }
}
