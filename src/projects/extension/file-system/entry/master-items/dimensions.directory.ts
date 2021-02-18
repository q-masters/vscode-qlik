import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem } from "../qix/qix.directory";
import { QixDimensionProvider } from "@core/qix/utils/dimension.provider";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";
import { Connection } from "projects/extension/connection/utils/connection";

@injectable()
export class DimensionDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixDimensionProvider) private dimensionProvider: QixDimensionProvider,
        @inject(FileSystemHelper) fileSystemHelper: FileSystemHelper
    ) {
        super(fileSystemHelper);
    }

    /**
     * delete a dimension
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection && app?.readonly === false) {
            const entry = connection.fileSystem.read(uri.toString(true));

            if (!entry || entry.type !== EntryType.DIMENSION) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.dimensionProvider.destroy(connection, app.id, entry.id);
            connection.fileSystem.delete(uri.toString(true));
        }
    }

    /**
     * load all measures
     */
    protected async loadData(uri: vscode.Uri): Promise<DirectoryItem<any>[]> {
        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (!app || !connection) {
            throw new Error(`could not find app for path: ${uri.toString(true)}`);
        }

        return this.dimensionProvider.list<any>(connection, app.id).pipe(
            map(
                (dimensions: any[]) => dimensions.map((measure) => this.mapDimensionToDirectory(measure))
            )
        ).toPromise();
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(dimension: DirectoryItem<any>, connection: Connection, uri: vscode.Uri): FilesystemEntry {

        const app  = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        return {
            id: dimension.id,
            fileType: vscode.FileType.File,
            name: this.fileSystemHelper.createFileName(uri, dimension.name),
            raw: dimension.data,
            readonly: app?.readonly ?? false,
            type: EntryType.DIMENSION,
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
