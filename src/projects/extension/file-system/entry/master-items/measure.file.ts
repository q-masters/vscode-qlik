import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";

import { Entry, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import path from "path";
import { Connection } from "projects/extension/connection/utils/connection";

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
    protected async read(connection: Connection, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }

    /**
     * write file, update or create a new variable
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection &&  app && app.readonly === false) {
            connection?.fileSystem.exists(uri)
                ? await this.updateMeasure(uri, content)
                : await this.createMeasure(uri, content);

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.name ?? ''}(${app?.id ?? ''}), app is read only.`);
    }

    /**
     * update existing measure
     */
    private async updateMeasure(uri: vscode.Uri, data: Uint8Array) {
        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const measure    = connection?.fileSystem.read(uri.toString(true));
        const content    = this.filesystemHelper.fileToJson(uri, data);

        if (connection && app && measure && measure.type === EntryType.MEASURE) {
            this.provider.update(connection, app.id, measure.id, content);
        }
    }

    /**
     * create measure
     */
    private async createMeasure(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const name       = this.filesystemHelper.resolveFileName(uri, false);

        if (app && connection) {
            let properties;

            try {
                properties = this.filesystemHelper.contentToJson<EngineAPI.IGenericDimensionProperties>(content);
            } catch (error) {
                properties = this.provider.createMeasureProperties(name);
            }

            const measure = await this.provider.create<any>(connection, app.id, properties);
            const data    = await measure.getLayout();

            connection.fileSystem.write(uri.toString(true), {
                id: measure.id,
                name: this.filesystemHelper.resolveFileName(uri),
                raw: data,
                readonly: app.readonly,
                type: EntryType.MEASURE,
                fileType: vscode.FileType.File
            });
            return;
        }
    }

    /**
     * rename measure
     */
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const measure    = connection?.fileSystem.read(uri.toString(true));

        if (app?.readonly === false && measure && connection) {

            const newName = path.posix.parse(newUri.path).name;
            await this.provider.rename(connection, app.id, measure.id, newName);

            connection.fileSystem.delete(uri.toString(true));
            connection.fileSystem.write(newUri.toString(true), {
                ...measure,
                name: newName
            });
        }
    }

    /**
     * move an existing measure
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {

        const target = await this.getConnection(to);
        const targetApp = target?.fileSystem.parent(to, EntryType.APPLICATION);

        const source = await this.getConnection(from);
        const sourceApp = source?.fileSystem.parent(from, EntryType.APPLICATION);
        const entry = source?.fileSystem.read(from.toString(true));

        if (!target || targetApp?.readonly) {
            throw vscode.FileSystemError.NoPermissions(`could not move measure ${targetApp?.id ?? ''} is readonly.`);
        }

        if (!source || !sourceApp || sourceApp?.readonly) {
            throw vscode.FileSystemError.NoPermissions(`could not remove measure from source, since ${sourceApp?.id ?? ''} is readonly, retry copy.`);
        }

        if (!entry || entry.type !== EntryType.DIMENSION) {
            throw vscode.FileSystemError.FileNotFound(`could not remove measure from source. Measure was not found.`);
        }

        /** write old content to new file */
        await this.writeFile(to, Buffer.from(await this.readFile(from)));

        /** finally delete old entry */
        await this.provider.destroy(source, sourceApp.id, entry.id);
        source?.fileSystem.delete(from.toString());
    }
}
