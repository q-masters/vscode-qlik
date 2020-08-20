import * as vscode from "vscode";
import { QixFsFileAdapter, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { DataNode, QixListProvider } from "@core/qix/utils/qix-list.provider";
import path from "path";

export abstract class QixFile extends QixFsFileAdapter {

    protected entryType = EntryType.UNKNOWN;

    public constructor(
        private fileSystemHelper: FileSystemHelper,
        protected provider: QixListProvider
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection && app) {
            const entry = connection.fileSystem.read(uri.toString(true));

            if (!entry || entry.type !== this.entryType) {
                return Buffer.from("Error, entrytype not matched (for example read script file but id is for a variable.");
            }

            const data =  await this.provider.read(connection, app.id, entry.id);
            return this.fileSystemHelper.renderFile(uri, data);
        }

        return Buffer.from("Error");
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {
        const connection = await this.getConnection(uri);
        if (connection?.fileSystem.exists(uri)) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 1,
                type: vscode.FileType.File,
            };
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * move an existing measure
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {

        const target    = await this.getConnection(to);
        const targetApp = target?.fileSystem.parent(to, EntryType.APPLICATION);

        const source = await this.getConnection(from);
        const sourceApp = source?.fileSystem.parent(from, EntryType.APPLICATION);
        const entry = source?.fileSystem.read(from.toString(true));

        /**
         * check we can move file into directory should not work if type is different
         */
        if (targetApp?.readonly || target?.fileSystem.read(to.toString(true))?.type !== this.entryType) {
            throw vscode.FileSystemError.NoPermissions(`could not move dimension ${targetApp?.id ?? ''} is readonly.`);
        }

        if (!source || !sourceApp || sourceApp?.readonly) {
            throw vscode.FileSystemError.NoPermissions(`could not remove dimension from source, since ${sourceApp?.id ?? ''} is readonly, retry copy.`);
        }

        if (!entry) {
            throw vscode.FileSystemError.FileNotFound();
        }

        /** write old content to new file */
        await this.writeFile(to, Buffer.from(await this.readFile(from)));

        /** finally delete old entry */
        await this.provider.destroy(source, sourceApp.id, entry.id);
        source.fileSystem.delete(from.toString(true));
    }

    /**
     * update / create visualization
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection &&  app && app.readonly === false) {
            connection?.fileSystem.exists(uri)
                ? await this.update(uri, content)
                : await this.create(uri, content);

            return;
        }

        throw vscode.FileSystemError.NoPermissions(`Not allowed made any changes to ${app?.name ?? ''}(${app?.id ?? ''}), app is read only.`);
    }

    /**
     * rename measure
     */
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const object     = connection?.fileSystem.read(uri.toString(true));

        if (app?.readonly === false && object && connection) {

            const newName = path.posix.parse(newUri.path).name;
            await this.provider.rename(connection, app.id, object.id, newName);

            connection.fileSystem.delete(uri.toString(true));
            connection.fileSystem.write(newUri.toString(true), {
                ...object,
                name: newName
            });
        }
    }

    /**
     * create new file
     */
    protected async create(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const name       = this.fileSystemHelper.resolveFileName(uri, false);

        if (app && connection) {
            let properties;

            try {
                properties = this.fileSystemHelper.contentToJson<EngineAPI.IGenericDimensionProperties>(content);
            } catch (error) {
                properties = this.provider.createProperties(name);
            }

            const object = await this.provider.create<any>(connection, app.id, properties);
            const data    = await object.getLayout();

            connection.fileSystem.write(uri.toString(true), {
                id: object.id,
                name: this.fileSystemHelper.resolveFileName(uri),
                raw: data,
                readonly: app.readonly,
                type: this.entryType,
                fileType: vscode.FileType.File
            });
            return;
        }
    }

    /**
     * could be general now
     */
    protected async update(uri: vscode.Uri, fileContent: Uint8Array): Promise<void> {
        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);
        const file       = connection?.fileSystem.read(uri.toString(true));
        const content    = this.fileSystemHelper.contentToJson<DataNode>(fileContent);

        if (connection && app && file && file.type === this.entryType) {
            this.provider.update(connection, app.id, file.id, content);
        }
    }
}
