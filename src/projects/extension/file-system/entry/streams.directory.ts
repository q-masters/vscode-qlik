import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";

import { QixFsDirectoryAdapter } from "./qix/qixfs-entry";
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

            if (!streams) {
                return [];
            }

            /** register to cache ? */
            return this.sanitizeStreams(streams).map((stream) => {
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

    /**
     * it is possible to have the a stream with the same name multiple times
     * ensure if streams with the same name exists we add the id at the end
     */
    protected sanitizeStreams(streams: EngineAPI.INxStreamListEntry[]): EngineAPI.INxStreamListEntry[] {

        const result: EngineAPI.INxStreamListEntry[] = [];
        const documentCache: Map<string, EngineAPI.INxStreamListEntry[]> = new Map();

        /** first loop to identify duplicated apps */
        streams.forEach((entry) => {
            ! documentCache.has(entry.qName)
                ? documentCache.set(entry.qName, [entry])
                : documentCache.get(entry.qName)?.push(entry);
        });

        const data = Array.from(documentCache.entries());

        /** second loop create names */
        for (let i = 0, ln = data.length; i < ln; i++) {
            const [name, entries] = data[i];

            for (let j = 0, appLn = entries.length; j < appLn; j++) {
                const entry      = entries[j];
                const streamName = entries.length > 1 ? `${name} (${entry.qId.substr(0, 9)})...` : name;

                result.push(Object.assign({}, entry, {qName: streamName}));
            }
        }
        return result;
    }
}
