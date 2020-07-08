import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { EnigmaSession } from "@core/connection";
import { map } from "rxjs/operators";

import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import { Entry, EntryType } from "../../data";

@injectable()
export class MeasureFile extends QixFile {

    protected entryType = EntryType.MEASURE;

    public constructor(
        @inject(QixMeasureProvider) private provider: QixMeasureProvider,
        @inject(FileSystemHelper) filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper);
    }

    /**
     * get stats of variable
     */
    public async stat(): Promise<vscode.FileStat | void> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.File,
        };
    }

    /**
     * read data
     */
    protected read(connection: EnigmaSession, app: string, entry: Entry): Promise<any> {
        return this.provider.read(connection, app, entry.id)
            .pipe(map(data => data.qMeasure))
            .toPromise();
    }
}
