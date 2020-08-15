import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";

import { QixFsDirectoryAdapter } from "../qix/qixfs-entry";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { EntryType } from "@vsqlik/fs/data";
import path from "path";

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
        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (connection && app) {
            const variables = await this.variableProvider.list(connection, app.id);
            const result = variables.map<[string, vscode.FileType.File]>((variable) => {

                const fileName = this.fileSystemHelper.createFileName(uri, variable.qName);
                const fileUri  = uri.with({path: path.posix.resolve(uri.path, `${fileName}`)});

                connection.fileSystemStorage.write(fileUri.toString(true), {
                    id: variable.qInfo.qId,
                    name: variable.qName,
                    raw: variable,
                    type: EntryType.VARIABLE,
                    readonly: app.readonly
                });

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
        const app        = connection?.fileSystemStorage.parent(uri, EntryType.APPLICATION);

        if (connection && app) {
            const variable = connection.fileSystemStorage.read(uri.toString(true));

            if (!variable?.id) {
                throw vscode.FileSystemError.Unavailable(uri);
            }

            const success = await this.variableProvider.deleteVariable(connection, app.id, variable.id);

            if (success) {
                connection.fileSystemStorage.delete(uri.toString(true));
            }
        }
    }
}
