import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import * as YAML from "yaml";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { FileRenderer } from "@vsqlik/settings/api";
import { QixFsFileAdapter, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";

@injectable()
export class VariableFile extends QixFsFileAdapter {

    private qlikVarTpl = {
        qName: "",
        qDefinition: "",
        qInfo: {
            qId: "",
            qType: "variable",
        },
        qComment: "",
        qIncludeInBookmark: false
    };

    public constructor(
        @inject(QixVariableProvider) private variableProvider: QixVariableProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (connection && app) {

            const variable = connection.fileSystemStorage.read(uri.toString(true));

            if (!variable || variable.type !== EntryType.VARIABLE) {
                return Buffer.from("Error");
            }

            const qVariable = await this.variableProvider.readVariable(connection, app.id, variable.id);
            const properties = await qVariable?.getProperties();

            const data  = {
                qDefinition: properties?.qDefinition ?? "",
                qComment: properties?.qComment ?? "",
                qNumberPresentation: properties?.qNumberPresentation,
                qIncludeInBookmark: properties?.qIncludeInBookmark ?? false
            };
            return this.fileSystemHelper.renderFile(uri, data);
        }

        return Buffer.from("Error");
    }

    /**
     * rename an existing variable
     */
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (app && connection) {

            const variable = connection.fileSystemStorage.read(uri.toString(true));

            if (!variable || variable.type !== EntryType.VARIABLE) {
                return;
            }

            const newName = this.fileSystemHelper.resolveFileName(newUri, false);
            const patch  = {qName: newName};

            // well this is now wrong for a move we need to delete and add
            await this.variableProvider.updateVariable(connection, app.id, variable.id, patch as any);

            connection.fileSystemStorage.delete(uri.toString(true));
            connection.fileSystemStorage.write(newUri.toString(true), Object.assign(variable, { name: newName }));
        }
    }

    /**
     * move an existing variable
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {
        const rawSource = await this.readFile(from);

        await this.writeFile(to, rawSource);

        const connection = await this.getConnection(from);
        const app        = connection?.fileSystemStorage.parent(from, EntryType.APPLICATION);

        if (!app || !connection) {
            throw vscode.FileSystemError.Unavailable();
        }

        const variable = connection.fileSystemStorage.read(from.toString(true));

        if (!variable || variable.type !== EntryType.VARIABLE) {
            throw vscode.FileSystemError.Unavailable();
        }

        this.variableProvider.deleteVariable(connection, app.id, variable.id);
        connection.fileSystemStorage.delete(from.toString(true));
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {

        const connection = await this.getConnection(uri);
        const variable   = connection?.fileSystemStorage.read(uri.toString(true));

        if(!variable || variable.type !== EntryType.VARIABLE) {
            throw vscode.FileSystemError.FileNotFound();
        }

        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.File,
        };
    }

    /**
     * write file, update or create a new variable
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);

        if (!connection) {
            return;
        }

        /** ist das eine neue variable oder existiert sie bereits ? */
        connection?.fileSystemStorage.exists(uri)
            ? await this.updateVariable(uri, content)
            : await this.createVariable(uri, content);
    }

    /**
     * create new variable if not exists
     */
    private async createVariable(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (!connection || !app) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const settings  = connection?.serverSettings;
        const name = this.fileSystemHelper.resolveFileName(uri, false);
        const raw  = content?.toString().trim().length ? content.toString() : "{}";
        const source = settings?.fileRenderer === FileRenderer.YAML ? YAML.parse(raw) : JSON.parse(raw);
        const data   = Object.assign({}, this.qlikVarTpl, source, {qName: name});
        const response = await this.variableProvider.createVariable(connection, app.id, data) as any;

        connection.fileSystemStorage.write(uri.toString(true), {
            id: response.id,
            name,
            raw: data,
            readonly: app.readonly,
            type: EntryType.VARIABLE
        });
    }

    /**
     * updates an existing variable, gets the diff of old value and new value
     * to create a patch on the variable
     */
    private async updateVariable(uri: vscode.Uri, content: Uint8Array) {

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (!connection || !app) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const variable = connection.fileSystemStorage.read(uri.toString(true));

        if (!variable || variable.type !== EntryType.VARIABLE) {
            throw new Error("could not write variable");
        }

        const source = this.fileSystemHelper.fileToJson(uri, await this.readFile(uri));
        const target = this.fileSystemHelper.fileToJson(uri, content);
        const patch  = this.fileSystemHelper.createPatch(target, source);

        this.variableProvider.updateVariable(connection, app.id, variable.id, patch);
    }
}
