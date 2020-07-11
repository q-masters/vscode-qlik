import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import { EnigmaSession } from "@core/connection";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";

import { Entry, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import { basename } from "path";

@injectable()
export class MeasureFile extends QixFile {

    protected entryType = EntryType.MEASURE;

    public constructor(
        @inject(QixMeasureProvider) private provider: QixMeasureProvider,
        @inject(FileSystemHelper) private filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper);
    }

    /**
     * read data
     */
    protected async read(connection: EnigmaSession, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }

    /**
     * write file, update or create a new variable
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        const app = this.filesystemHelper.resolveApp(uri);

        if (app && app.readonly === false) {
            this.filesystemHelper.exists(uri)
                ? await this.updateMeasure(uri, content)
                : await this.createMeasure(uri);

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.data.data.qTitle}(${app?.id ?? ''}), app is read only.`);
    }

    /**
     * update existing measure
     */
    private async updateMeasure(uri: vscode.Uri, data: Uint8Array) {

        const connection = await this.getConnection(uri) as EnigmaSession;
        const app        = this.filesystemHelper.resolveApp(uri);
        const measure    = this.filesystemHelper.resolveEntry(uri, EntryType.MEASURE, false);
        const content    = this.filesystemHelper.fileToJson(uri, data);

        if (app && measure) {
            this.provider.update(connection, app.id, measure.id, content);
        }
    }

    /**
     * create measure
     */
    private async createMeasure(uri: vscode.Uri) {

        const connection = await this.getConnection(uri) as EnigmaSession;
        const name       = this.filesystemHelper.resolveFileName(uri, false);
        const app        = this.filesystemHelper.resolveApp(uri);

        if (app) {
            const measure = await this.provider.create<any>(connection, app.id, this.provider.createMeasureProperties(basename(name)));
            const data    = await measure.getLayout();

            /**
             * cache entry so next time we load this one from cache and do not have to call
             * api again (for example stats)
             */
            this.filesystemHelper.cacheEntry(
                uri,
                {
                    id: measure.id,
                    readonly: false,
                    type: EntryType.MEASURE,
                    data: data
                }
            );

            return;
        }
    }
}
