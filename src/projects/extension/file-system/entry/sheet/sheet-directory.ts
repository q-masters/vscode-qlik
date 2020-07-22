import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixDirectory, DirectoryItem, DirectoryEntry } from "../qix/qix.directory";
import { EnigmaSession } from "@core/connection";
import { Observable, from } from "rxjs";
import { FileSystemHelper } from "@vsqlik/fs/utils/file-system.helper";
import { map } from "rxjs/operators";
import { QixSheetProvider } from "@core/qix/utils/sheet.provider";
import { EntryType } from "@vsqlik/fs/data";

@injectable()
export class SheetDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixSheetProvider) private provider: QixSheetProvider,
        @inject(FileSystemHelper) fileSystemHelper: FileSystemHelper
    ) {
        super(fileSystemHelper);
    }

    protected loadData(connection: EnigmaSession, uri: vscode.Uri): Observable<DirectoryItem<any>[]> {

        const app = this.fileSystemHelper.resolveAppId(uri);
        if (!app) {
            throw new Error(`could not find app for path: ${uri.toString(true)}`);
        }

        return from(this.provider.list(connection, app)).pipe(
            map(
                (dimensions: any[]) => dimensions.map((sheet) => ({
                    name: sheet.qData.title,
                    id: sheet.qInfo.qId,
                    data: sheet
                }))
            )
        );
    }

    protected generateEntry(data: DirectoryItem<any>, uri: vscode.Uri): DirectoryEntry {
        const fileName = this.fileSystemHelper.createFileName(uri, data.name);
        const app = this.fileSystemHelper.resolveApp(uri);
        return {
            entry: {
                id: data.id,
                type: EntryType.SHEET,
                data: data.data,
                readonly: app?.readonly ?? false
            },
            item: [fileName, vscode.FileType.File]
        };
    }
}
