import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { map } from "rxjs/operators";

import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem } from "../qix/qix.directory";
import { FilesystemEntry } from "@vsqlik/fs/utils/file-system.storage";
import { Connection } from "projects/extension/connection/utils/connection";
import { QixVisualizationProvider } from "@core/qix/utils/visualization.provider";

@injectable()
export class VisualizationDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixVisualizationProvider) private visualizationProvider: QixVisualizationProvider,
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

            if (!entry || entry.type !== EntryType.VISUALIZATION) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.visualizationProvider.destroy(connection, app.id, entry.id);
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

        return this.visualizationProvider.list<any>(connection, app.id).pipe(
            map(
                (visualizations: any[]) => visualizations.map((visualization) => this.mapToDirectory(visualization))
            )
        ).toPromise();
    }

    /**
     * ressolve data for file system
     */
    protected generateEntry(visualization: DirectoryItem<any>, connection: Connection, uri: vscode.Uri): FilesystemEntry {
        const app  = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        return {
            id: visualization.id,
            fileType: vscode.FileType.File,
            name: this.fileSystemHelper.createFileName(uri, visualization.name),
            raw: visualization.data,
            readonly: app?.readonly ?? false,
            type: EntryType.VISUALIZATION,
        };
    }

    /**
     * map measure data to DirectoryItem
     */
    private mapToDirectory(visualization: any): DirectoryItem<any> {
        return {
            name: visualization.qData.name,
            id: visualization.qInfo.qId,
            data: visualization
        };
    }
}
