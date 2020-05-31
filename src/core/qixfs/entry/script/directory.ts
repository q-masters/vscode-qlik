import * as vscode from "vscode";
import { posix, resolve } from "path";
import { QixRouter } from "../../utils";
import { QixFsFile, QixFsDirectoryAdapter } from "../entry";

export class ScriptDirectory extends QixFsDirectoryAdapter {

    public readDirectory(): [string, vscode.FileType][] {
        return [["main.qvs", vscode.FileType.File]];
    }

    /**
     * create new file on app script directory
     */
    public async createFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        const fileUri   = uri.with({path: resolve(posix.dirname(uri.path), "main.qvs")});
        const route = QixRouter.find(fileUri);
        if (route?.entry && route.entry.type === vscode.FileType.File) {
            await (route.entry as QixFsFile).writeFile(fileUri, content, route.params);
        }
    }

    public stat(): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        };
    }
}
