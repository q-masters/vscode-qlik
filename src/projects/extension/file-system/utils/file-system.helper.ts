import * as vscode from "vscode";
import { posix } from "path";
import { singleton, inject } from "tsyringe";
import { transform, isEqual, isObject } from 'lodash';
import YAML from "yaml";

import { CacheRegistry, CacheToken } from "@shared/utils/cache-registry";
import { ApplicationCache } from "../data/cache";

import { FileRenderer } from "@vsqlik/settings/api";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils/registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";

const TEMPORARY_FILES = new CacheToken("temporary files");

@singleton()
export class FileSystemHelper {

    public constructor(
        @inject(WorkspaceFolderRegistry) private workspaceRegistry: WorkspaceFolderRegistry,
        @inject(CacheRegistry) private fileCache: CacheRegistry
    ) {
        this.fileCache.registerCache(TEMPORARY_FILES);
    }

    public resolveWorkspace(uri: vscode.Uri): WorkspaceFolder | undefined {
        return this.workspaceRegistry.resolveByUri(uri);
    }

    /**
     * resolves the app id by a given uri
     */
    public resolveAppId(uri: vscode.Uri): string | undefined {

        const appPath = posix.parse(uri.path).dir.match(/^\/[^/]+/);
        if (!appPath) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const appUri = uri.with({path: appPath[0]});
        return this.fileCache.resolve<string>(ApplicationCache, appUri.toString());
    }

    /**
     * register a temporary entry, for example if we copy a script file
     * into an other script directory we could not show 2 files main.qvs and main copy.qvs
     * in this case we write the content of main copy.qvs into main.qvs and register
     * main copy.qvs as temporary file.
     */
    public registerTempoaryFileEntry(uri: vscode.Uri, content?: Uint8Array) {
        this.fileCache.add(TEMPORARY_FILES, uri.toString(), content);
    }

    /**
     * check given uri is a temporary file
     */
    public isTemporaryFileEntry(uri: vscode.Uri): boolean {
        return this.fileCache.exists(TEMPORARY_FILES, uri.toString());
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
        return this.fileCache.delete(TEMPORARY_FILES, uri.toString());
    }

    /**
     * resolve file name by given uri
     */
    public resolveFileName(uri: vscode.Uri): string {
        return posix.parse(uri.toString()).name;
    }

    /**
     * get diff of 2 json objects
     * @see https://gist.github.com/Yimiprod/7ee176597fef230d1451
     */
    public getJsonDiff(source, target) {
        return transform(source, (result, value, key) => {
            if (!isEqual(value, target[key])) {
                result[key] = isObject(value) && isObject(target[key]) ? this.getJsonDiff(value, target[key]) : value;
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
        return uri.with({path: posix.resolve(uri.path, `${name}.${prefix}`)});
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
}
