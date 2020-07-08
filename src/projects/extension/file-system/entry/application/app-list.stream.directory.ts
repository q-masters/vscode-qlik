import * as vscode from "vscode";
import { AppListDirectory } from "./app-list.directory";
import { DoclistEntry } from "@core/qix/api/api";
import { EntryType } from "../../data";

/**
 * writeable app list directory, used for my work for example where we have default
 * crud operations for qix applications
 */
export class AppListStreamDirectory extends AppListDirectory {

    protected onAppsLoaded(apps: DoclistEntry[], uri: vscode.Uri): DoclistEntry[] {
        /** get stream of this one */
        const stream  = this.filesystemHelper.resolveEntry(uri, EntryType.STREAM);
        return apps.filter((entry) => entry.qMeta.published && entry.qMeta.stream.id === stream?.id);
    }
}
