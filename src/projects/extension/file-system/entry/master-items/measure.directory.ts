import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem } from "../qix/qix.directory";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";

@injectable()
export class MeasureDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixMeasureProvider) private measureProvider: QixMeasureProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper
    ) {
        super();
    }

    /**
     * delete an variable
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const connection = this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (connection && app && app.readonly === false) {
            const entry = connection.fileSystemStorage.read(uri.toString(true));

            if (!entry || entry.type !== EntryType.MEASURE) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.measureProvider.destroy(connection, app.id, entry.id);
            connection.fileSystemStorage.delete(uri.toString());
        }
    }

    /**
     * load all measures
     */
    protected loadData(uri: vscode.Uri): Observable<DirectoryItem<any>[]> {

        const connection = this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (!app || !connection) {
            throw new Error(`could not find app for path: ${uri.toString(true)}`);
        }

        return this.measureProvider.list<any>(connection, app.id).pipe(
            map(
                (measures: any[]) => measures.map((measure) => this.mapMeasureToDirectoryItem(measure))
            )
        );
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(measure: DirectoryItem<any>, uri: vscode.Uri): FilesystemEntry {

        const connection = this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        return {
            id: measure.id,
            fileType: vscode.FileType.File,
            name: this.fileSystemHelper.createFileName(uri, measure.name),
            raw: measure.data,
            readonly: app?.readonly ?? false,
            type: EntryType.MEASURE,
        };
    }

    /**
     * map measure data to DirectoryItem
     */
    private mapMeasureToDirectoryItem(measure: any): DirectoryItem<any> {
        return {
            name: measure.qMeta.title,
            id: measure.qInfo.qId,
            data: measure
        };
    }
}
