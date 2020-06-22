import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import * as YAML from "yaml";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { FileRenderer } from "@vsqlik/settings/api";
import { QixFsFileAdapter } from "../data";
import { FileSystemHelper } from "../utils/file-system.helper";

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
        @inject(CacheRegistry) private fileCache: CacheRegistry<WorkspaceFolder>
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if (connection && app_id && workspace) {

            const var_id = this.fileCache.resolve<string>(workspace, uri.toString(true));

            if (!var_id) {
                return Buffer.from("Error");
            }

            const variable   = await this.variableProvider.readVariable(connection, app_id, var_id);
            const properties = await variable?.getProperties();

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
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if (app_id && connection && workspace) {
            const var_id = this.fileCache.resolve<string>(workspace, uri.toString(true));

            if (!var_id) {
                return;
            }

            const newName = this.fileSystemHelper.resolveFileName(newUri, false);
            const patch  = {qName: newName};

            // well this is now wrong for a move we need to delete and add
            await this.variableProvider.updateVariable(connection, app_id, var_id, patch as any);

            this.fileCache.delete(workspace, uri.toString(true));
            this.fileCache.add(workspace, newUri.toString(true), var_id);
        }
    }

    /**
     * move an existing variable
     */
    public async move(from: vscode.Uri, to: vscode.Uri): Promise<void> {
        const rawSource = await this.readFile(from);

        await this.writeFile(to, rawSource);

        const connection = await this.getConnection(from);
        const app_id     = this.fileSystemHelper.resolveAppId(from);
        const workspace  = this.fileSystemHelper.resolveWorkspace(from);

        if (!app_id || !connection || !workspace) {
            throw vscode.FileSystemError.Unavailable();
        }

        const var_id = this.fileCache.resolve<string>(workspace, from.toString(true));

        if (!var_id) {
            throw vscode.FileSystemError.Unavailable();
        }

        this.variableProvider.deleteVariable(connection, app_id, var_id);
        this.fileCache.delete(workspace, from.toString(true));
    }

    /**
     * get stats of variable
     */
    public async stat(uri: vscode.Uri): Promise<vscode.FileStat | void> {
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if(!workspace || !this.fileCache.exists(workspace, uri.toString(true))){
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
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if (!connection || !app_id || !workspace) {
            return;
        }

        /** ist das eine neue variable oder existiert sie bereits ? */
        this.fileCache.exists(workspace, uri.toString(true))
            ? await this.updateVariable(uri, content)
            : await this.createVariable(uri, content);
    }

    /**
     * create new variable if not exists
     */
    private async createVariable(uri: vscode.Uri, content: Uint8Array): Promise<void> {

        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);

        if (!connection || !app_id) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const workspace = this.fileSystemHelper.resolveWorkspace(uri);
        const settings  = workspace?.settings;
        const name = this.fileSystemHelper.resolveFileName(uri, false);
        const raw  = content?.toString().trim().length ? content.toString() : "{}";

        const source = settings?.fileRenderer === FileRenderer.YAML ? YAML.parse(raw) : JSON.parse(raw);
        const data   = Object.assign({}, this.qlikVarTpl, source, {qName: name});

        /**
         * response has qId but it should called only id, so cast to any
         */
        const response = await this.variableProvider.createVariable(connection, app_id, data) as any;

        /** after variable has been created add to cache */
        if (workspace) {
            this.fileCache.add(workspace, uri.toString(true), response.id);
        }
    }

    /**
     * updates an existing variable, gets the diff of old value and new value
     * to create a patch on the variable
     */
    private async updateVariable(uri: vscode.Uri, content: Uint8Array) {

        const workspace = this.fileSystemHelper.resolveWorkspace(uri);
        const app_id    = this.fileSystemHelper.resolveAppId(uri);

        const connection = await this.getConnection(uri);

        if (!connection || !app_id || !workspace) {
            throw new Error("could not write variable, not connected or app not exists");
        }

        const var_id = this.fileCache.resolve<string>(workspace, uri.toString(true));

        if (!var_id) {
            throw new Error("could not write variable");
        }

        const source = this.fileSystemHelper.fileToJson(uri, await this.readFile(uri));
        const target = this.fileSystemHelper.fileToJson(uri, content);
        const patch  = this.fileSystemHelper.createPatch(target, source);

        this.variableProvider.updateVariable(connection, app_id, var_id, patch);
    }
}
