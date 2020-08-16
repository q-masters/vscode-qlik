import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";

import { Entry, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import path from "path";
import { QixDimensionProvider } from "@core/qix/utils/dimension.provider";
import { Connection } from "projects/extension/connection/utils/connection";

@injectable()
export class DimensionFile extends QixFile {

    protected entryType = EntryType.DIMENSION;

    public constructor(
        @inject(QixDimensionProvider) private provider: QixDimensionProvider,
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
        const app = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (connection && app && app.readonly === false) {
            connection?.fileSystemStorage.exists(uri)
                ? await this.updateDimension(uri, content)
                : await this.createDimension(uri, content);

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.name ?? ''}(${app?.id ?? ''}), app is read only.`);
    }

    /**
     * update existing measure
     */
    private async updateDimension(uri: vscode.Uri, data: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);
        const measure = connection?.fileSystemStorage.read(uri.toString(true));
        const content = this.filesystemHelper.fileToJson(uri, data);

        if (connection && app && measure) {
            this.provider.update(connection, app.id, measure.id, content);
        }
    }

    /**
     * create measure
     */
    private async createDimension(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);
        const name = this.filesystemHelper.resolveFileName(uri, false);

        if (app && connection) {

            let properties;

            try {
                properties = this.filesystemHelper.contentToJson<EngineAPI.IGenericDimensionProperties>(content);
            } catch (error) {
                properties = this.provider.createDimensionProperties(name);
            }

            const dimension = await this.provider.create<any>(connection, app.id, properties);
            const data      = await dimension.getLayout();

            connection.fileSystemStorage.write(uri.toString(true), {
                id: dimension.id,
                name: this.filesystemHelper.resolveFileName(uri),
                raw: data,
                readonly: app.readonly,
                type: EntryType.DIMENSION,
                fileType: vscode.FileType.File
            });
            return;
        }
    }

    /**
     * rename measure
     */
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);
        const dimension  = connection?.fileSystemStorage.read(uri.toString(true));

        if (app && !app.readonly && dimension && connection) {
            const newName = path.posix.parse(newUri.path).name;
            await this.provider.rename(connection, app.id, dimension.id, newName);
            connection.fileSystemStorage.rename(uri, newUri);
        }
    }

    /**
     * move an existing measure
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {

        const target = this.getConnection(to);
        const targetApp = target?.fileSystemStorage.parent(to, EntryType.APPLICATION);

        const source = this.getConnection(from);
        const sourceApp = source?.fileSystemStorage.parent(from, EntryType.APPLICATION);
        const entry = source?.fileSystemStorage.read(from.toString(true));

        if (targetApp?.readonly) {
            throw vscode.FileSystemError.NoPermissions(`could not move dimension ${targetApp?.id ?? ''} is readonly.`);
        }

        if (!source || !sourceApp || sourceApp?.readonly) {
            throw vscode.FileSystemError.NoPermissions(`could not remove dimension from source, since ${sourceApp?.id ?? ''} is readonly, retry copy.`);
        }

        if (!entry || entry.type !== EntryType.DIMENSION) {
            throw vscode.FileSystemError.FileNotFound(`could not remove dimension from source. Dimension was not found.`);
        }

        /** write old content to new file */
        await this.writeFile(to, Buffer.from(await this.readFile(from)));

        /** finally delete old entry */
        await this.provider.destroy(source, sourceApp.id, entry.id);
        source.fileSystemStorage.delete(from.toString(true));
    }
}
