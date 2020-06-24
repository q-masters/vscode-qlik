import * as vscode from "vscode";
import * as path from "path";
import { singleton, inject } from "tsyringe";
import { transform, isEqual, isObject } from 'lodash';
import YAML from "yaml";

import { FileRenderer } from "@vsqlik/settings/api";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils/registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { CacheRegistry, CacheToken } from "@shared/utils/cache-registry";
import { posix } from "path";

const TEMPORARY_FILES = new CacheToken("temporary files");

@singleton()
export class FileSystemHelper {

    public constructor(
        @inject(WorkspaceFolderRegistry) private workspaceRegistry: WorkspaceFolderRegistry,
        @inject(CacheRegistry) private cacheRegistry: CacheRegistry<CacheToken|WorkspaceFolder>,
    ) {
        this.cacheRegistry.registerCache(TEMPORARY_FILES);
    }

    /**
     * get current workspace folder by given uri
     */
    public resolveWorkspace(uri: vscode.Uri): WorkspaceFolder | undefined {
        return this.workspaceRegistry.resolveByUri(uri);
    }

    /**
     * resolves the app id by a given uri
     */
    public resolveAppId(uri: vscode.Uri): string | undefined {
        const appPath   = /^(\/[^/]+)(\/.*)?$/.test(uri.path);
        const workspace = this.resolveWorkspace(uri);

        if (!appPath || !workspace) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const appUri = uri.with({path: RegExp.$1});
        return this.cacheRegistry.resolve<string>(workspace, appUri.toString(true));
    }

    /**
     * register a temporary entry, for example if we copy a script file
     * into an other script directory we could not show 2 files main.qvs and main copy.qvs
     * in this case we write the content of main copy.qvs into main.qvs and register
     * main copy.qvs as temporary file.
     */
    public registerTempoaryFileEntry(uri: vscode.Uri, content?: Uint8Array) {
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
    public deleteTempoaryFileEntry(uri: vscode.Uri) {
        vscode.commands.executeCommand(`vsqlik.qixfs.delete`, uri);
    }

    /**
     * register a temporary file in CacheRegistry
     */
    public unregisterTemporaryFile(uri: vscode.Uri) {
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
    public createPatch(source, target) {
        return transform(source, (result, value, key) => {
            if (!isEqual(value, target[key])) {
                result[key] = isObject(value) && isObject(target[key]) ? this.createPatch(value, target[key]) : value;
            }
        });
    }

    /**
     * create file uri
     *
     * @param {vscode.Uri} uri the uri to the directory
     * @param {string} name of the file
     */
    public createFileUri(uri: vscode.Uri, name: string): vscode.Uri {
        const setting   = this.resolveWorkspace(uri)?.settings;
        const prefix    = setting?.fileRenderer === FileRenderer.YAML ? 'yaml' : 'json';
        return uri.with({path: path.posix.resolve(uri.path, `${name}.${prefix}`)});
    }

    /**
     * create a directory uri
     */
    public createDirectoryUri(uri: vscode.Uri, name: string): vscode.Uri {
        return uri.with({path: path.posix.resolve(uri.path, `${name}`)});
    }

    /**
     * render file content in specific format like YAML or JSON
     */
    public renderFile(uri: vscode.Uri, source: Object): Uint8Array {
        const setting = this.resolveWorkspace(uri)?.settings;
        const content = setting?.fileRenderer === FileRenderer.YAML
            ? YAML.stringify(source, {indent: 2})
            : JSON.stringify(source, null, 4);

        return Buffer.from(content);
    }

    /**
     * convert file content back to json format
     */
    public fileToJson(uri: vscode.Uri, source: Uint8Array): Object {
        const setting = this.resolveWorkspace(uri)?.settings;
        const content = setting?.fileRenderer === FileRenderer.YAML
            ? YAML.parse(source.toString())
            : JSON.parse(source.toString());

        return content;
    }

    /**
     * check file or directory exists
     */
    public exists(uri: vscode.Uri): boolean {
        const workspaceFolder = this.resolveWorkspace(uri);
        if (workspaceFolder) {
            return this.cacheRegistry.exists(workspaceFolder, uri.toString(true));
        }
        return false;
    }

    /**
     * directory has been renamed, so we need to update the workspace cache
     */
    public renameDirectory(source: vscode.Uri, target: vscode.Uri) {
        const workspaceFolder = this.resolveWorkspace(source);
        const sourceUri       = source.toString(true);

        if (workspaceFolder) {

            const entries = this.cacheRegistry.getKeys(workspaceFolder) ?? [];

            /** resolve relative path between both */
            for (const filePath of entries) {

                if (!filePath.startsWith(sourceUri)) {
                    continue;
                }

                const relativePath = filePath.substr(sourceUri.length).replace(/^\//, '');
                const newEntryUri  = target.with({path: posix.resolve(target.path, relativePath)});
                const oldEntryUri  = source.with({path: posix.resolve(source.path, relativePath)});
                const entryData    = this.cacheRegistry.resolve(workspaceFolder, oldEntryUri.toString(true));

                this.cacheRegistry.delete(workspaceFolder, oldEntryUri.toString(true));
                this.cacheRegistry.add(workspaceFolder   , newEntryUri.toString(true), entryData);
            }
        }
    }

    /**
     * delete a directory
     */
    public deleteDirectory(source: vscode.Uri) {
        const workspaceFolder = this.resolveWorkspace(source);

        if (workspaceFolder) {
            const entries = this.cacheRegistry.getKeys(workspaceFolder) ?? [];
            for (const filePath of entries) {
                if (!filePath.startsWith(source.toString())) {
                    continue;
                }
                this.cacheRegistry.delete(workspaceFolder, filePath);
            }
        }
    }
}
