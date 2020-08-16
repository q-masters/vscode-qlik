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
        @inject(QixSheetProvider) private provider: QixSheetProvider,
        @inject(FileSystemHelper) private filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper);
    }

    /**
     * read data
     */
    protected async read(connection: Connection, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }

    /**
     * write file
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (app && !app.readonly) {
            connection?.fileSystem.exists(uri)
                ? await this.updateSheet(uri, content)
                : await this.createSheet();

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.name ?? ''} (${app?.id ?? ''}), app is read only.`);
    }

    private async createSheet() {
        throw new Error("Operation not supported for sheets.");
    }

    /**
     * update current sheet
     */
    private async updateSheet(uri: vscode.Uri, content: Uint8Array) {

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
