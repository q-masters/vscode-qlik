import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem } from "../qix/qix.directory";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";
import { Connection } from "projects/extension/connection/utils/connection";

@injectable()
export class MeasureDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixMeasureProvider) private measureProvider: QixMeasureProvider,
        @inject(FileSystemHelper) fileSystemHelper: FileSystemHelper
    ) {
        super(fileSystemHelper);
    }

    /**
     * delete an variable
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection && app && app.readonly === false) {
            const entry = connection.fileSystem.read(uri.toString(true));

            if (!entry || entry.type !== EntryType.MEASURE) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.measureProvider.destroy(connection, app.id, entry.id);
            connection.fileSystem.delete(uri.toString());
        }
    }

    /**
     * load all measures
     */
    protected async loadData(uri: vscode.Uri): Promise<DirectoryItem<any>[]> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (!connection || !app) {
            return [];
        }

        return this.measureProvider.list<any>(connection, app.id)
            .pipe(
                map((measures: any[]) => measures.map((measure) => this.mapMeasureToDirectoryItem(measure)))
            ).toPromise();
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(measure: DirectoryItem<any>, connection: Connection, uri: vscode.Uri): FilesystemEntry {

        const app = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

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
