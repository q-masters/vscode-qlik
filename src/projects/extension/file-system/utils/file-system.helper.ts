import * as vscode from "vscode";
import { posix } from "path";
import { singleton, injectable, inject } from "tsyringe";
import { transform, isEqual, isObject } from 'lodash';
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils/registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { CacheRegistry, CacheToken } from "@core/utils/cache-registry";
import { ApplicationCache } from "../data/cache";

const TEMPORARY_FILES = new CacheToken("temporary files");

@singleton()
@injectable()
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
}
