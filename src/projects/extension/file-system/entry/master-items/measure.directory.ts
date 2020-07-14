import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { EnigmaSession } from "@core/connection";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem, DirectoryEntry } from "../qix/qix.directory";

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
        const app        = this.fileSystemHelper.resolveApp(uri);

        if (connection && app?.readonly === false) {
            const entry = this.fileSystemHelper.resolveEntry(uri, EntryType.MEASURE, false);

            if (!entry) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.measureProvider.destroy(connection, app.id, entry.id);
            this.fileSystemHelper.deleteEntry(uri);
        }
    }

    /**
     * load all measures
     */
    protected loadData(connection: EnigmaSession, uri: vscode.Uri): Observable<DirectoryItem<any>[]> {
        const app = this.fileSystemHelper.resolveAppId(uri);
        if (!app) {
            throw new Error(`could not find app for path: ${uri.toString(true)}`);
        }

        return this.measureProvider.list<any>(connection, app).pipe(
            map(
                (measures: any[]) => measures.map((measure) => this.mapMeasureToDirectoryItem(measure))
            )
        );
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(measure: DirectoryItem<any>, uri: vscode.Uri): DirectoryEntry {
        const fileName = this.fileSystemHelper.createFileName(uri, measure.name);
        const app = this.fileSystemHelper.resolveApp(uri);

        return {
            entry: {
                id: measure.id,
                type: EntryType.MEASURE,
                data: measure.data,
                readonly: app?.readonly ?? false
            },
            item: [fileName, vscode.FileType.File]
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
