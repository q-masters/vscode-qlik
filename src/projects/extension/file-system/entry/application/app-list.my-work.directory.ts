import * as vscode from "vscode";
import { injectable } from "tsyringe";
import { map, switchMap } from "rxjs/operators";
import { AppListDirectory } from "./app-list.directory";
import { DoclistEntry } from "@core/qix/api/api";
import { EntryType } from "@vsqlik/fs/data";

declare type CreateAppResult = {
    qSuccess: boolean;
    qAppId: string;
}

/**
 * writeable app list directory, used for my work for example where we have default
 * crud operations for qix applications
 */
@injectable()
export class AppListMyWorkDirectory extends AppListDirectory {

    /**
     * create a new app
     */
    public async createDirectory(uri: vscode.Uri, name: string): Promise<void> {
        const connection = this.getConnection(uri);

        if (connection) {
            return this.applicationProvider.createApp(connection, name).pipe(
                /**
                 * switch to app data
                 */
                switchMap((result: CreateAppResult) => {
                    if (!result.qSuccess) {
                        throw new Error(`could not create app ${name}`);
                    }
                    return this.applicationProvider.getAppData(connection, result.qAppId);
                }),
                /**
                 * add data to file cache so we find it again
                 */
                map((entry: EngineAPI.IAppEntry) => {
                    connection.fileSystemStorage.write(uri.toString(true), {
                        name: entry.qTitle,
                        raw: entry,
                        id: entry.qID,
                        readonly: false,
                        type: EntryType.APPLICATION
                    });
                })
            ).toPromise();
        }
        throw new Error("not connected");
    }

    /**
     * delete an existing app
     */
    public async delete(uri: vscode.Uri): Promise<void> {
        const connection = await this.getConnection(uri);

        if (connection) {
            const fsEntry = connection.fileSystemStorage.read(uri.toString(true));
            if (!fsEntry || fsEntry.type !== EntryType.APPLICATION) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await this.applicationProvider.deleteApp(connection, fsEntry.id);
            await connection.closeSession(fsEntry.id);

            connection.fileSystemStorage.deleteDirectory(uri);
        }
    }

    /**
     * filter out all apps which are published
     */
    protected onAppsLoaded(apps: DoclistEntry[]): DoclistEntry[] {
        return apps.filter((entry) => !entry.qMeta.published);
    }
}
