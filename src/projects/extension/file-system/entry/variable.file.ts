import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import * as YAML from "yaml";

import { RouteParam } from "@core/router";
import { QixVariableProvider } from "@core/qix/utils/variable.provider";

import { QixFsFileAdapter } from "../data";
import { FileSystemHelper } from "../utils/file-system.helper";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { VariableCache } from "../data/cache";
import { posix } from "path";
import { FileRenderer } from "@vsqlik/settings/api";

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
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {

        const workspace = this.fileSystemHelper.resolveWorkspace(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);

        const settings   = workspace?.settings;
        const connection = await this.getConnection(uri);

        if (!connection || !app_id) {
            return Buffer.from("Error");
        }

        const variable = await this.variableProvider.readVariable(connection, app_id, this.sanitizeName(params.name));

        if (variable) {
            const properties = await variable.getProperties();
            const data  = {
                qDefinition: properties?.qDefinition ?? "",
                qComment: properties?.qComment ?? "",
                qNumberPresentation: properties?.qNumberPresentation,
                qIncludeInBookmark: properties?.qIncludeInBookmark ?? false
            };

            return Buffer.from(
                settings?.fileRenderer === FileRenderer.YAML
                    ? YAML.stringify(data, {indent: 4})
                    : JSON.stringify(data, null, 4)
            );
        }

        return Buffer.from("Error");
    }

    /**
     * rename an existing variable
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async rename(uri: vscode.Uri, newUri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);

        const newName = posix.parse(newUri.toString()).name;
        const oldName = posix.parse(uri.toString()).name;

        if (app_id && connection) {
            const patch = {qName: newName};
            await this.variableProvider.updateVariable(connection, app_id, oldName, patch as any);

            const variable_id = this.fileCache.resolve(VariableCache, uri.toString()) as string;
            this.fileCache.delete(VariableCache, uri.toString());
            this.fileCache.add(VariableCache, newUri.toString(), variable_id);
        }
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {

        if( !this.fileCache.exists(VariableCache, uri.toString()) ){
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
    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {

        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);

        if (!connection || !app_id) {
            return;
        }

        /** ist das eine neue variable oder existiert sie bereits ? */
        this.fileCache.exists(VariableCache, uri.toString())
            ? await this.updateVariable(uri, content, params)
            : await this.createVariable(uri, content, params);
    }

    /**
     * get name of variable
     */
    private sanitizeName(value: string = ""): string {
        return /(.*?)(\.\w+)?$/g.test(value) ? RegExp.$1 : value;
    }

    /**
     * create new variable if not exists
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private async createVariable(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);

        if (!connection || !app_id) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);
        const settings   = workspace?.settings;

        const name       = this.sanitizeName(params.name);
        const raw        = content?.toString().trim().length ? content.toString() : "{}";

        const source     = settings?.fileRenderer === FileRenderer.YAML ? YAML.parse(raw) : JSON.parse(raw);
        const varContent = Object.assign({}, this.qlikVarTpl, source, {qName: name});

        await this.variableProvider.createVariable(connection, app_id, varContent);

        /** after variable has been created add to cache */
        this.fileCache.add(VariableCache, uri.toString(), "");
    }

    /**
     * updates an existing variable, gets the diff of old value and new value
     * to create a patch on the variable
     */
    private async updateVariable(uri: vscode.Uri, content: Uint8Array, params: RouteParam) {
        const workspace = this.fileSystemHelper.resolveWorkspace(uri);
        const app_id    = this.fileSystemHelper.resolveAppId(uri);
        const name      = this.fileSystemHelper.resolveFileName(uri);

        const settings = workspace?.settings;
        const connection = await this.getConnection(uri);

        if (!connection || !app_id) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const source   = (await this.readFile(uri, params)).toString();
        const target   = content.toString();

        const oldValue = settings?.fileRenderer === FileRenderer.YAML ? YAML.parse(source) : JSON.parse(source);
        const newValue = settings?.fileRenderer === FileRenderer.YAML ? YAML.parse(target) : JSON.parse(target);
        const patch    = this.fileSystemHelper.getJsonDiff(newValue, oldValue);

        this.variableProvider.updateVariable(connection, app_id, name, patch);
    }
}
