import * as vscode from "vscode";
import { QixFile } from "../qix/qix.file";
import { Entry, EntryType } from "@vsqlik/fs/data";
import { inject } from "tsyringe";
import { FileSystemHelper } from "@vsqlik/fs/utils/file-system.helper";
import { QixSheetProvider } from "@core/qix/utils/sheet.provider";
import { Connection } from "projects/extension/connection/utils/connection";

export class SheetFile extends QixFile {

    protected entryType = EntryType.SHEET;

    public constructor(
        @inject(QixSheetProvider) provider: QixSheetProvider,
        @inject(FileSystemHelper) private filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper, provider);
    }

    /**
     * read data
     */
    protected async read(connection: Connection, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }

    protected async create() {
        throw new Error("Operation not supported for sheets.");
    }

    /**
     * update current sheet
     */
    protected async update(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const sheet      = connection?.fileSystem.read(uri.toString(true));

        if (connection && app && sheet?.type === EntryType.SHEET) {
            const data = this.filesystemHelper.fileToJson(uri, content) as EngineAPI.IGenericObjectEntry;
            return await this.provider.write(connection, app.id, sheet.id, data);
        }

        throw new Error("could not update sheet");
    }
}
