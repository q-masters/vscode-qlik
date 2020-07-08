import * as vscode from "vscode";
import * as path from "path";
import { singleton, inject } from "tsyringe";
import { transform, isEqual, isObject } from 'lodash';
import YAML from "yaml";

import { FileRenderer } from "@vsqlik/settings/api";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils/registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { CacheRegistry, CacheToken } from "@shared/utils/cache-registry";
import { EntryType, Entry, ApplicationEntry } from "../data";

const TEMPORARY_FILES = new CacheToken("temporary files");

export declare type DirectoryList = [string, vscode.FileType.Directory][];

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

    public createFileName(uri: vscode.Uri, name: string) {
        const setting = this.resolveWorkspace(uri)?.settings;
        const prefix  = setting?.fileRenderer === FileRenderer.YAML ? 'yaml' : 'json';
        /**
         * we have to replace some special chars like / since this one is a directory
         * seperator
         */
        return `${name.replace(/\//, '|')}.${prefix}`;

    }

    /**
     * create a entry uri
     */
    public createEntryUri(uri: vscode.Uri, name: string): vscode.Uri {
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
     * resolves the app id by a given uri
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public resolveAppId(uri: vscode.Uri): string | undefined {
        const app = this.resolveApp(uri);
        return app?.id;
    }

    /**
     * resolves app data by given uri
     */
    public resolveApp(uri): ApplicationEntry | undefined {
        return this.resolveEntry(uri, EntryType.APPLICATION);
    }

    public resolveEntry<T extends Entry>(uri, type: EntryType): T | undefined {
        const workspace = this.resolveWorkspace(uri);

        if (workspace) {
            let entryPath = uri.path;
            do {
                const entry = this.cacheRegistry.resolve<Entry>(workspace, uri.with({path: entryPath}).toString(true));
                if (entry && entry.type === type) {
                    return entry as T;
                }
                entryPath = path.posix.dirname(entryPath);
            } while(entryPath !== "/");
        }
    }

    public cacheEntry<T extends Entry>(uri, data: T): void {
        const workspace = this.resolveWorkspace(uri);

        if (workspace) {
            this.cacheRegistry.add(workspace, uri.toString(true), data);
        }
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
                const newEntryUri  = target.with({path: path.posix.resolve(target.path, relativePath)});
                const oldEntryUri  = source.with({path: path.posix.resolve(source.path, relativePath)});
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

    /*
    public addDirectory(workspace: WorkspaceFolder, uri: vscode.Uri, data) {
        /*
        this.cacheRegistry.add<ApplicationEntry>(workspace, uri.toString(true), {
            type: EntryType.APPLICATION,
            data: entries[j] as DoclistEntry
        });
    }
        */
}
