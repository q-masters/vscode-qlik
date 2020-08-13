import * as vscode from "vscode";
import { QixFile } from "../qix/qix.file";
import { EnigmaSession } from "projects/extension/connection";
import { Entry, EntryType } from "@vsqlik/fs/data";
import { inject } from "tsyringe";
import { FileSystemHelper } from "@vsqlik/fs/utils/file-system.helper";
import { QixSheetProvider } from "@core/qix/utils/sheet.provider";

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
    protected async read(connection: EnigmaSession, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }

    /**
     * write file
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        const app = this.filesystemHelper.resolveApp(uri);

        if (app && app.readonly === false) {
            this.filesystemHelper.exists(uri)
                ? await this.updateSheet(uri, content)
                : await this.createSheet();

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.data.data.qTitle}(${app?.id ?? ''}), app is read only.`);
    }

    private async createSheet() {
        throw new Error("Operation not supported for sheets.");
    }

    /**
     * update current sheet
     */
    private async updateSheet(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app        = this.filesystemHelper.resolveApp(uri);
        const sheet      = this.filesystemHelper.resolveEntry(uri, this.entryType);

        if (sheet?.id && app?.id) {
            const data = this.filesystemHelper.fileToJson(uri, content) as EngineAPI.IGenericObjectEntry;
            return await this.provider.write(connection, app.id, sheet.id, data);
        }

        throw new Error("could not update sheet");
    }
}
