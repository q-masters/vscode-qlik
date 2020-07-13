import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";

import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { FileSystemHelper } from "../../utils/file-system.helper";

@injectable()
export class VariableDirectory extends QixFsDirectoryAdapter{

    public constructor(
        @inject(QixVariableProvider) private variableProvider: QixVariableProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry<WorkspaceFolder>
    ) {
        super();
    }

    /**
     * static library which allways exists
     */
    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {

        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.Directory
        };
    }

    /**
     * read variable directory
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const app        = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if (connection && app && workspace) {
            const variables = await this.variableProvider.list(connection, app);
            const result = variables.map<[string, vscode.FileType.File]>((variable) => {

                const fileName = this.fileSystemHelper.createFileName(uri, variable.qName);
                const fileUri  = this.fileSystemHelper.createEntryUri(uri, fileName);

                this.fileCache.add(workspace, fileUri.toString(true), variable.qInfo.qId);
                return [fileName, vscode.FileType.File];
            });
            return result;
        }

        return [];
    }

    /**
     * delete an variable
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const connection = await this.getConnection(uri);
        const app_id     = this.fileSystemHelper.resolveAppId(uri);
        const workspace  = this.fileSystemHelper.resolveWorkspace(uri);

        if (connection && app_id && workspace) {
            const var_id = this.fileCache.resolve<string>(workspace, uri.toString(true));

            if (!var_id) {
                throw vscode.FileSystemError.Unavailable(uri);
            }

            const success = await this.variableProvider.deleteVariable(connection, app_id, var_id);

            if (success) {
                this.fileCache.delete(workspace, uri.toString(true));
            }
        }
    }
}
