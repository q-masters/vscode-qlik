import * as vscode from "vscode";
import { injectable } from "tsyringe";
import { map, switchMap } from "rxjs/operators";
import { QixFsAppListDirectory } from "./app-list.directory";
import { DoclistEntry } from "@core/qix/api/api";

declare type CreateAppResult = {
    qSuccess: boolean;
    qAppId: string;
}

/**
 * writeable app list directory, used for my work for example where we have default
 * crud operations for qix applications
 */
@injectable()
export class QixFsAppListMyWorkDirectory extends QixFsAppListDirectory {

    /**
     * create a new app
     */
    public async createDirectory(uri: vscode.Uri, name: string): Promise<void> {
        const connection = await this.getConnection(uri);
        const workspace  = this.filesystemHelper.resolveWorkspace(uri);

        if (connection && workspace) {
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
                    this.cacheApplicationDirectory(entry, uri);
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
        const app_id     = this.filesystemHelper.resolveAppId(uri);

        if (connection) {
            if (!app_id) {
                throw vscode.FileSystemError.FileNotFound();
            }

            await connection.close(app_id);
            await this.applicationProvider.deleteApp(connection, app_id);
            this.filesystemHelper.deleteDirectory(uri);
        }
    }

    /**
     * filter out all apps which are published
     */
    protected onAppsLoaded(apps: DoclistEntry[]): DoclistEntry[] {
        return apps.filter((entry) => !entry.qMeta.published);
    }
}
