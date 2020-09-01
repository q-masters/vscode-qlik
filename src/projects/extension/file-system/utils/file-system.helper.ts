import * as vscode from "vscode";
import * as path from "path";
import { singleton, inject } from "tsyringe";
import { transform, isEqual, isObject } from 'lodash';
import YAML from "yaml";

import { FileRenderer, WorkspaceSetting } from "@vsqlik/settings/api";
import { CacheRegistry, CacheToken } from "@shared/utils/cache-registry";
import { SettingsRepository } from "@vsqlik/settings/settings.repository";
import { DataNode } from "@core/qix/utils/qix-list.provider";

const TEMPORARY_FILES = new CacheToken("temporary files");

export declare type DirectoryList = [string, vscode.FileType.Directory][];

@singleton()
export class FileSystemHelper {

    public constructor(
        @inject(CacheRegistry) private cacheRegistry: CacheRegistry<CacheToken>,
        @inject(SettingsRepository) private settingsRepository: SettingsRepository
    ) {
        this.cacheRegistry.registerCache(TEMPORARY_FILES);
    }

    /**
     * register a temporary entry, for example if we copy a script file
     * into an other script directory we could not show 2 files main.qvs and main copy.qvs
     * in this case we write the content of main copy.qvs into main.qvs and register
     * main copy.qvs as temporary file.
     */
    public registerTempoaryFileEntry(uri: vscode.Uri, content?: Uint8Array): void {
        this.cacheRegistry.add(TEMPORARY_FILES, uri.toString(true), content);
    }

    /**
     * check given uri is a temporary file
     */
    public isTemporaryFileEntry(uri: vscode.Uri): boolean {
        return this.cacheRegistry.exists(TEMPORARY_FILES, uri.toString(true));
    }

    /**
     * remove a temporary file from CacheRegistry
     */
    public deleteTempoaryFileEntry(uri: vscode.Uri): void {
        vscode.commands.executeCommand(`vsqlik.qixfs.delete`, uri);
    }

    /**
     * register a temporary file in CacheRegistry
     */
    public unregisterTemporaryFile(uri: vscode.Uri): unknown {
        return this.cacheRegistry.delete(TEMPORARY_FILES, uri.toString(true));
    }

    /**
     * resolve file name by given uri
     *
     * @param uri file system uri
     * @param ext include ext for example 'index.html' default is true
     */
    public resolveFileName(uri: vscode.Uri, ext = true): string {
        const parsed = path.posix.parse(uri.path);
        return ext ? parsed.base : parsed.name;
    }

    /**
     * get diff of 2 json objects
     * @see https://gist.github.com/Yimiprod/7ee176597fef230d1451
     */
    public createPatch(source: DataNode, target: DataNode): DataNode{
        return transform(source, (result, value, key) => {
            if (!isEqual(value, target[key])) {
                result[key] = isObject(value) && isObject(target[key]) ? this.createPatch(value, target[key]) : value;
            }
        });
    }

    public createFileName(uri: vscode.Uri, name: string): string {
        const setting = this.resolveWorkspaceSetting(uri);
        const prefix  = setting?.fileRenderer === FileRenderer.YAML ? 'yaml' : 'json';
        /** replace \ and / by unicode characters so they will not replaced by vscode anymore */
        return `${name.replace(/\u002F/g, '\uFF0F').replace(/[\uFE68\uFF3C]/g, '\u005C')}.${prefix}`;
    }

    /**
     * render file content in specific format like YAML or JSON
     */
    public renderFile(uri: vscode.Uri, source: DataNode): Uint8Array {
        const setting = this.resolveWorkspaceSetting(uri);
        const content = setting?.fileRenderer === FileRenderer.YAML
            ? YAML.stringify(source, {indent: 2})
            : JSON.stringify(source, null, 4);

        return Buffer.from(content);
    }

    /**
     * convert file content back to json format
     */
    public fileToJson(uri: vscode.Uri, source: Uint8Array): DataNode {
        const setting = this.resolveWorkspaceSetting(uri);
        const content = setting?.fileRenderer === FileRenderer.YAML
            ? YAML.parse(source.toString())
            : JSON.parse(source.toString());

        return content;
    }

    /**
     * convert buffer to json (could be yaml or json)
     */
    public contentToJson<T>(source: Uint8Array): T {
        const content = source.toString();
        return YAML.parse(content) || JSON.parse(content) || '';
    }

    private resolveWorkspace(uri: vscode.Uri): vscode.WorkspaceFolder | undefined {
        return vscode.workspace.getWorkspaceFolder(uri);
    }

    private resolveWorkspaceSetting(uri: vscode.Uri): WorkspaceSetting | undefined {
        const workspace = this.resolveWorkspace(uri);
        return workspace ? this.settingsRepository.find(workspace.name) : void 0;
    }
}
