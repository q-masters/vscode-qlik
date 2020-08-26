import * as vscode from "vscode";
import { injectable } from "tsyringe";
import { QixFsDirectoryAdapter } from "./qix/qixfs-entry";
import { DirectoryList } from "../utils/file-system.helper";

@injectable()
export class QixFsRootDirectory extends QixFsDirectoryAdapter {

    /**
     *
     */
    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 2,
            type: vscode.FileType.Directory
        };
    }

    /**
     * read out all existing apps from qlik,
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType.Directory][]> {

        const connection = await this.getConnection(uri);

        if (!connection) {
            return [];
        }

        const global     = await connection?.openSession();
        const isQlikCore = (await global?.getConfiguration())?.qFeatures.qIsDesktop;

        const directories: DirectoryList = [
            ['my work', vscode.FileType.Directory]
        ];

        if (!isQlikCore) {
            directories.push(['streams', vscode.FileType.Directory]);
        }

        return directories;
    }
}
