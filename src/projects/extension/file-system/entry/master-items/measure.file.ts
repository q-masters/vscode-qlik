import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import { EnigmaSession } from "projects/extension/connection";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";

import { Entry, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import path from "path";

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
                : await this.createMeasure(uri, content);

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
    private async createMeasure(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri) as EnigmaSession;
        const name       = this.filesystemHelper.resolveFileName(uri, false);
        const app        = this.filesystemHelper.resolveApp(uri);

        if (app) {

            let properties;

            try {
                properties = this.filesystemHelper.contentToJson<EngineAPI.IGenericDimensionProperties>(content);
            } catch (error) {
                properties = this.provider.createMeasureProperties(name);
            }

            const measure = await this.provider.create<any>(connection, app.id, properties);
            const data    = await measure.getLayout();

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

    /**
     * rename measure
     */
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = this.filesystemHelper.resolveEntry(uri, EntryType.APPLICATION);
        const measure    = this.filesystemHelper.resolveEntry(uri, EntryType.MEASURE, false);

        if (app?.readonly === false && measure && connection) {

            const newName = path.posix.parse(newUri.path).name;
            const result  = await this.provider.rename(connection, app.id, measure.id, newName);

            this.filesystemHelper.deleteEntry(uri);
            this.filesystemHelper.cacheEntry(newUri, {
                id: measure.id,
                readonly: false,
                type: EntryType.MEASURE,
                data: result
            });
        }
    }

    /**
     * move an existing measure
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {
        const source = this.filesystemHelper.resolveEntry(from, EntryType.APPLICATION);
        const target = this.filesystemHelper.resolveEntry(to, EntryType.APPLICATION);

        if (target?.readonly !== false) {
            throw vscode.FileSystemError.NoPermissions(`could not move measure ${(target as any).id} is readonly.`);
        }

        if (source?.readonly !== false) {
            throw vscode.FileSystemError.NoPermissions(`could not remove measure from source, since ${(source as any).id} is readonly, retry copy.`);
        }

        /** write old content to new file */
        await this.writeFile(to, Buffer.from(await this.readFile(from)));

        /** finally delete old entry */
        const connection = await this.getConnection(from) as EnigmaSession;
        const entry      = this.filesystemHelper.resolveEntry(from, EntryType.MEASURE, false) as Entry;

        await this.provider.destroy(connection, source.id, entry.id);
        this.filesystemHelper.deleteEntry(from);
    }
}
