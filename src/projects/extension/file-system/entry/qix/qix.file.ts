import * as vscode from "vscode";
import { QixFsFileAdapter, EntryType, Entry } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { EnigmaSession } from "@core/connection";

export abstract class QixFile extends QixFsFileAdapter {

    protected entryType = EntryType.UNKNOWN;

    public constructor(
        private fileSystemHelper: FileSystemHelper,
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        const app        = this.fileSystemHelper.resolveAppId(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);
        const connection = await this.getConnection(uri);

        if (connection && app && workspace) {
            const entry = this.fileSystemHelper.resolveEntry(uri, this.entryType);

            if (!entry) {
                return Buffer.from("Error");
            }

            const data = await this.read(connection, app, entry);
            return this.fileSystemHelper.renderFile(uri, data);
        }

        return Buffer.from("Error");
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {
        if (this.fileSystemHelper.exists(uri)) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 1,
                type: vscode.FileType.File,
            };
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    protected abstract read(connection: EnigmaSession, app: string, entry: Entry): Promise<any>;
}
