import * as vscode from "vscode";
import { AppListDirectory } from "./app-list.directory";
import { DoclistEntry } from "@core/qix/api/api";

/**
 * writeable app list directory, used for my work for example where we have default
 * crud operations for qix applications
 */
export class AppListStreamDirectory extends AppListDirectory {
    protected onAppsLoaded(apps: DoclistEntry[], uri: vscode.Uri): DoclistEntry[] {
        const stream = this.getConnection(uri)?.fileSystemStorage.read(uri.toString(true));
        if (!stream) {
            return [];
        }
        return apps.filter((app) => app.qMeta.stream?.id === stream.id);
    }
}
