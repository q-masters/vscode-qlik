/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { FileSystemHelper } from "../utils/file-system.helper";
import { QixDirectory, DirectoryItem } from "./qix.directory";
import { EnigmaSession } from "@core/connection";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@injectable()
export class MeasureDirectory extends QixDirectory<any> {

    public constructor(
        @inject(QixMeasureProvider) private measureProvider: QixMeasureProvider,
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
     * load all measures
     */
    protected loadData(connection: EnigmaSession, app: string): Observable<DirectoryItem<any>[]> {
        return this.measureProvider.list(connection, app).pipe(
            map(
                (measures: any[]) => measures.map((measure) => this.mapMeasureToDirectoryItem(measure))
            )
        );
    }

    /**
     * create directory list
     */
    protected buildEntryList(data: DirectoryItem<any>[], uri: vscode.Uri): [string, vscode.FileType][] {
        return data.map((measure) => {
            const fileUri  = this.fileSystemHelper.createFileUri(uri, measure.name);
            const fileName = this.fileSystemHelper.resolveFileName(fileUri);

            return [fileName, vscode.FileType.File];
        });
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
