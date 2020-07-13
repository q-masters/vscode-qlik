/** vendor */
import * as vscode from "vscode";
import { inject } from "tsyringe";
import { QixApplicationProvider } from "@core/qix/utils/application.provider";
import { EnigmaSession } from "@core/connection";
import { DoclistEntry } from "@core/qix/api/api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixDirectory, DirectoryItem, DirectoryEntry } from "../qix/qix.directory";
import { EntryType } from "@vsqlik/fs/data";

/**
 * Base list directory for qix applications, this is only readonly
 * used for streams which contains published apps which cant modified anymore
 */
export abstract class AppListDirectory extends QixDirectory<DoclistEntry> {

    protected abstract onAppsLoaded(apps: DoclistEntry[], uri: vscode.Uri): DoclistEntry[];

    /**
     * if set to true, we only fetch published apps
     */
    protected published = true;

    public constructor(
        @inject(QixApplicationProvider) protected applicationProvider: QixApplicationProvider,
        @inject(FileSystemHelper) protected filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper);
    }

    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        };
    }

    /**
     * load all available apps
     */
    protected loadData(connection: EnigmaSession, uri: vscode.Uri): Observable<DirectoryItem<DoclistEntry>[]> {
        return this.applicationProvider.list(connection)
            .pipe(
                /** map to filtered list, exclude published apps and apps in streams */
                map((apps: DoclistEntry[]) => this.onAppsLoaded(apps, uri)),
                map((apps) => apps.map((app): DirectoryItem<DoclistEntry> => ({
                    id: app.qDocId,
                    name: app.qTitle,
                    data: app
                })))
            );
    }

    /**
     * generate entry data for cache and file system
     */
    protected generateEntry(app: DirectoryItem<DoclistEntry>): DirectoryEntry {
        return {
            entry: {
                id: app.id,
                readonly: !!app.data.qMeta.published,
                type: EntryType.APPLICATION,
                data: app
            },
            item: [app.name, vscode.FileType.Directory]
        };
    }
}
