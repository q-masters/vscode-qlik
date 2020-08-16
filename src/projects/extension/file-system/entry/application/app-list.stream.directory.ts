import * as vscode from "vscode";
import { AppListDirectory } from "./app-list.directory";
import { DoclistEntry } from "@core/qix/api/api";
import { Connection } from "projects/extension/connection/utils/connection";

/**
 * writeable app list directory, used for my work for example where we have default
 * crud operations for qix applications
 */
export class AppListStreamDirectory extends AppListDirectory {

    protected onAppsLoaded(apps: DoclistEntry[], connection: Connection, uri: vscode.Uri): DoclistEntry[] {
        const stream = connection.fileSystem.read(uri.toString(true));
        if (!stream) {
            return [];
        }
        return apps.filter((app) => app.qMeta.stream?.id === stream.id);
    }
}
