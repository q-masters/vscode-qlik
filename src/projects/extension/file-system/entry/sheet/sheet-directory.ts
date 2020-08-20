import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixDirectory, DirectoryItem } from "../qix/qix.directory";
import { QixSheetProvider } from "@core/qix/utils/sheet.provider";
import { EntryType } from "@vsqlik/fs/data";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";
import { FileSystemHelper } from "@vsqlik/fs/utils/file-system.helper";
import { Connection } from "projects/extension/connection/utils/connection";
import { map } from "rxjs/operators";

@injectable()
export class SheetDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixSheetProvider) private provider: QixSheetProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper
    ) {
        super();
    }

    protected async loadData(uri: vscode.Uri): Promise<DirectoryItem<any>[]> {

        const connection = await this.getConnection(uri);
        const app = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (!app || !connection ) {
            throw new Error(`could not find app for path: ${uri.toString(true)}`);
        }

        return this.provider.list<any>(connection, app.id)
            .pipe(
                map((sheets) => sheets.map((sheet) => {
                    console.dir(sheet);
                    return {
                        name: sheet.qData.title,
                        id: sheet.qInfo.qId,
                        data: sheet
                    };
                }))
            ).toPromise();
    }

    protected generateEntry(sheet: DirectoryItem<any>, connection: Connection, uri: vscode.Uri): FilesystemEntry {
        const app = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        return {
            id: sheet.id,
            fileType: vscode.FileType.File,
            name: this.fileSystemHelper.createFileName(uri, sheet.name),
            raw: sheet.data,
            readonly: app?.readonly ?? false,
            type: EntryType.SHEET,
        };
    }
}
