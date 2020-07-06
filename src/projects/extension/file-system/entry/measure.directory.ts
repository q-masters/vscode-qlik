import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixFsDirectoryAdapter } from "./qixfs-entry";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { FileSystemHelper } from "../utils/file-system.helper";
import { map } from "rxjs/operators";

@injectable()
export class MeasureDirectory extends QixFsDirectoryAdapter{

    public constructor(
        @inject(QixMeasureProvider) private measureProvider: QixMeasureProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper
    ) {
        super();
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
     * read variable directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<any> {
        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);

        if (!connection || !app_id) {
            throw vscode.FileSystemError.NoPermissions();
        }

        return this.measureProvider.list(connection, app_id)
            .pipe(
                map((data) => this.sanitizeMeasureFileNames(data)),
                map((data) => this.buildFileList(data, uri))
            ).toPromise();
    }

    /**
     * it is possible to have the a stream with the same name multiple times
     * ensure if streams with the same name exists we add the id at the end
     */
    protected sanitizeMeasureFileNames(measures: any[]): any[] {
        const result: any[] = [];
        const documentCache: Map<string, any> = new Map();

        /** first loop to identify duplicated apps */
        measures.forEach((measure) => {
            ! documentCache.has(measure.qMeta.title)
                ? documentCache.set(measure.qMeta.title, [measure])
                : documentCache.get(measure.qMeta.title)?.push(measure);
        });

        const data = Array.from(documentCache.entries());

        /** second loop create names */
        for (let i = 0, ln = data.length; i < ln; i++) {
            const [name, entries] = data[i];

            for (let j = 0, appLn = entries.length; j < appLn; j++) {
                const entry      = entries[j];
                const streamName = entries.length > 1 ? `${name} (${entry.qInfo.qId.substr(0, 9)})...` : name;

                result.push(Object.assign({}, entry, {qName: streamName}));
            }
        }
        return result;
    }

    /**
     * build file list
     */
    private buildFileList(measures: any[], uri: vscode.Uri) {
        return measures.map((measure) => {
            const fileUri  = this.fileSystemHelper.createFileUri(uri, measure.qMeta.title);
            const fileName = this.fileSystemHelper.resolveFileName(fileUri);

            return [fileName, vscode.FileType.File];
        });
    }

}
