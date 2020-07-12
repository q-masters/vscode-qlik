import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { EnigmaSession } from "@core/connection";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem, DirectoryEntry } from "../qix/qix.directory";
import { QixDimensionProvider } from "@core/qix/utils/dimension.provider";

@injectable()
export class DimensionDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixDimensionProvider) private dimensionProvider: QixDimensionProvider,
        @inject(FileSystemHelper) fileSystemHelper: FileSystemHelper
    ) {
        super(fileSystemHelper);
    }

    /**
     * static library which allways exists
     */
    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.Directory
        };
    }

    /**
     * delete a dimension
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = this.fileSystemHelper.resolveApp(uri);

        if (connection && app?.readonly === false) {
            const entry = this.fileSystemHelper.resolveEntry(uri, EntryType.DIMENSION, false);

            if (!entry) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.dimensionProvider.destroy(connection, app.id, entry.id);
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

        return this.dimensionProvider.list<any>(connection, app).pipe(
            map(
                (dimensions: any[]) => dimensions.map((measure) => this.mapDimensionToDirectory(measure))
            )
        );
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(dimension: DirectoryItem<any>, uri: vscode.Uri): DirectoryEntry {
        const fileName = this.fileSystemHelper.createFileName(uri, dimension.name);
        const app = this.fileSystemHelper.resolveApp(uri);

        return {
            entry: {
                id: dimension.id,
                type: EntryType.DIMENSION,
                data: dimension.data,
                readonly: app?.readonly ?? false
            },
            item: [fileName, vscode.FileType.File]
        };
    }

    /**
     * map measure data to DirectoryItem
     */
    private mapDimensionToDirectory(dimension: any): DirectoryItem<any> {
        return {
            name: dimension.qMeta.title,
            id: dimension.qInfo.qId,
            data: dimension
        };
    }
}
