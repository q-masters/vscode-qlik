import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";

import { QixFsDirectoryAdapter } from "./qixfs-entry";
import { DirectoryList } from "../utils/file-system.helper";
import { CacheRegistry } from "@core/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { resolve } from "path";
import { Entry, EntryType } from "../data";

@injectable()
export class QixFsStreamRootDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(CacheRegistry) private cacheRegistry: CacheRegistry<WorkspaceFolder>
    ) {
        super();
    }

    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }

    public async readDirectory(uri: vscode.Uri): Promise<DirectoryList> {
        const connection = await this.getConnection(uri);
        const workspace  = this.getWorkspace(uri);

        if (connection && workspace) {
            const global  = await connection.open();
            const streams = await global?.getStreamList();

            /** register to cache ? */
            return streams?.map((stream) => {
                const streamUri = uri.with({path: resolve(uri.path, stream.qName)});

                this.cacheRegistry.add<Entry>(workspace, streamUri.toString(true), {
                    type: EntryType.STREAM,
                    id: stream.qId,
                    readonly: true
                });

                return [stream.qName, vscode.FileType.Directory];
            }) || [];
        }
        return [];
    }
}
