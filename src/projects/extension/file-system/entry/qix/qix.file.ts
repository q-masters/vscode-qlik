import * as vscode from "vscode";
import { QixFsFileAdapter, EntryType, Entry } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { Connection } from "projects/extension/connection/utils/connection";

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

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection && app) {
            const entry = connection.fileSystem.read(uri.toString(true));

            if (!entry || entry.type !== this.entryType) {
                return Buffer.from("Error, entrytype not matched (for example read script file but id is for a variable.");
            }

            const data = await this.read(connection, app.id, entry);
            return this.fileSystemHelper.renderFile(uri, data);
        }

        return Buffer.from("Error");
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {
        const connection = await this.getConnection(uri);
        if (connection?.fileSystem.exists(uri)) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 1,
                type: vscode.FileType.File,
            };
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    protected abstract read(connection: Connection, app: string, entry: Entry): Promise<any>;
}
