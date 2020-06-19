import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";

import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";

import { QixFsDirectoryAdapter } from "../data/entry";
import { ApplicationCache } from "../data/cache";
import { FileSystemHelper } from "../utils/file-system.helper";
import path from "path";

declare type CreateAppResult = {
    qSuccess: boolean;
    qAppId: string;
}

@injectable()
export class QixFsRootDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(QixApplicationProvider) private applicationProvider: QixApplicationProvider,
        @inject(CacheRegistry) private cacheRegistry: CacheRegistry,
    ) {
        super();
    }

    /**
     *
     */
    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }

    /**
     * read out all existing apps from qlik,
     * since app's could be have the same name we have to append the ID
     * to the name.
     *
     * to make this work get a list of all doclist items we have to run 2 loops
     *
     * First loop get all apps and save them into a map <AppName, Entry[]>
     * Second loop writes check if entry[].length > 1 if this is the case the name exists twice
     * and we need to add the ID
     */
    public async readDirectory(uri: vscode.Uri) {

        const connection = await this.getConnection(uri);

        if (!connection) {
            return [];
        }

        const documents  = await this.applicationProvider.list(connection);
        const result: [string, vscode.FileType.Directory][] =  [];
        const documentCache: Map<string, EngineAPI.IDocListEntry[]> = new Map();

        /** first loop to identify duplicated apps */
        documents.forEach((entry: EngineAPI.IDocListEntry) => {
            ! documentCache.has(entry.qDocName)
                ? documentCache.set(entry.qDocName, [entry])
                : documentCache.get(entry.qDocName)?.push(entry);
        });

        const data = Array.from(documentCache.entries());

        /** second loop create names */
        for (let i = 0, ln = data.length; i < ln; i++) {
            const [name, entries] = data[i];

            for (let j = 0, appLn = entries.length; j < appLn; j++) {
                const appName = entries.length > 1 ? `${name}\n${entries[j].qDocId}` : name;
                const appPath = path.resolve(uri.path, appName);

                /** write apps to cache */
                this.cacheRegistry.add(
                    ApplicationCache,
                    uri.with({ path: appPath }).toString(),
                    entries[j].qDocId
                );

                result.push([appName, vscode.FileType.Directory]);
            }
        }

        return result;
    }

    /**
     * create a new app
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async createDirectory(uri: vscode.Uri, name: string): Promise<void> {
        const connection = await this.getConnection(uri);

        if (connection) {
            const result     = await this.applicationProvider.createApp(connection, name) as CreateAppResult;
            if (!result.qSuccess) {
                throw new Error(`could not create app ${name}`);
            }
            this.cacheRegistry.add(ApplicationCache, uri.toString(), result.qAppId);
        }
    }

    /**
     * delete an existing app
     */
    public async delete(uri: vscode.Uri): Promise<void> {
        const connection = await this.getConnection(uri);

        if (connection) {
            const app_id = this.cacheRegistry.resolve<string>(ApplicationCache, uri.toString());

            if (!app_id) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await connection.close(app_id);
            await this.applicationProvider.deleteApp(connection, app_id);
            this.cacheRegistry.delete(ApplicationCache, uri.toString());
        }
    }
}
