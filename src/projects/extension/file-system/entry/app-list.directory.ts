/** vendor */
import * as vscode from "vscode";
import { inject } from "tsyringe";
import { map } from "rxjs/operators";
import { QixApplicationProvider } from "@core/qix/utils/application.provider";
import { DoclistEntry, DoclistEntryMeta } from "@core/qix/api/api";
import { CacheRegistry } from "@core/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { ApplicationEntry, EntryType } from "../data";
import { FileSystemHelper, DirectoryList } from "../utils/file-system.helper";
import { QixFsDirectoryAdapter } from "./qixfs-entry";
import { RouteParam } from "@core/router";

/**
 * Base list directory for qix applications, this is only readonly
 * used for streams which contains published apps which cant modified anymore
 */
export abstract class QixFsAppListDirectory extends QixFsDirectoryAdapter {

    /**
     * if set to true, we only fetch published apps
     */
    protected published = true;

    public constructor(
        @inject(QixApplicationProvider) protected applicationProvider: QixApplicationProvider,
        @inject(FileSystemHelper) protected filesystemHelper: FileSystemHelper,
        @inject(CacheRegistry) protected cacheRegistry: CacheRegistry<WorkspaceFolder>
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

    public async readDirectory(uri: vscode.Uri, params: RouteParam): Promise<DirectoryList> {

        const connection = await this.getConnection(uri);
        if (!connection) {
            return [];
        }

        return this.applicationProvider.list(connection)
            .pipe(
                /** map to filtered list, exclude published apps and apps in streams */
                map((apps: DoclistEntry[]) => this.onAppsLoaded(apps, uri, params)),
                /** map doclist entries to vscode directory list */
                map<DoclistEntry[], DirectoryList>((apps: DoclistEntry[]) => this.createApplicationDirectoryList(uri, apps))
            )
            .toPromise();
    }

    /**
     * create application filesystem list for qixfs provider, save all direcctories
     * into cache
     */
    protected createApplicationDirectoryList(uri: vscode.Uri, apps: DoclistEntry[]): DirectoryList {

        const workspace = this.filesystemHelper.resolveWorkspace(uri);
        const result: [string, vscode.FileType.Directory][] =  [];
        const documentCache: Map<string, EngineAPI.IDocListEntry[]> = new Map();

        if (!workspace) {
            return [];
        }

        /** first loop to identify duplicated apps */
        apps.forEach((entry: EngineAPI.IDocListEntry) => {
            ! documentCache.has(entry.qTitle)
                ? documentCache.set(entry.qTitle, [entry])
                : documentCache.get(entry.qTitle)?.push(entry);
        });

        const data = Array.from(documentCache.entries());

        /** second loop create names */
        for (let i = 0, ln = data.length; i < ln; i++) {
            const [name, entries] = data[i];

            for (let j = 0, appLn = entries.length; j < appLn; j++) {
                const entry   = entries[j];
                const appName = entries.length > 1 ? `${name}\n${entry.qDocId}` : name;
                result.push([appName, vscode.FileType.Directory]);

                const appUri  = this.filesystemHelper.createDirectoryUri(uri, appName);
                this.cacheApplicationDirectory(entry, appUri);
            }
        }
        return result;
    }

    /**
     * write application to cache
     */
    protected cacheApplicationDirectory(app, uri: vscode.Uri): boolean {

        const workspace = this.filesystemHelper.resolveWorkspace(uri);

        if (!workspace) {
            return false;
        }

        this.cacheRegistry.add<ApplicationEntry>(workspace, uri.toString(true), {
            type: EntryType.APPLICATION,
            readonly: !!(app.qMeta as DoclistEntryMeta).published,
            id: app.qDocId || app.qID,
            data: app.qMeta
        });

        return true;
    }

    protected abstract onAppsLoaded(apps: DoclistEntry[], uri?: vscode.Uri, params?: RouteParam): DoclistEntry[];
}
