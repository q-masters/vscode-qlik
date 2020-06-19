import * as vscode from "vscode";
import { injectable, inject } from "tsyringe";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { CacheRegistry } from "@shared/utils/cache-registry";

import { QixFsDirectoryAdapter } from "../data/entry";
import { FileSystemHelper } from "../utils/file-system.helper";
import { FileRenderer } from "@vsqlik/settings/api";
import { posix } from "path";
import { VariableCache } from "../data/cache";

@injectable()
export class VariableDirectory extends QixFsDirectoryAdapter{

    public constructor(
        @inject(QixVariableProvider) private variableProvider: QixVariableProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry
    ) {
        super();
    }

    public stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.Directory
        };
    }

    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const app        = this.fileSystemHelper.resolveAppId(uri);
        const connection = await this.getConnection(uri);

        if (connection && app) {
            const workspace = this.fileSystemHelper.resolveWorkspace(uri);
            const variables = await this.variableProvider.list(connection, app);
            const setting   = workspace?.settings;
            const prefix    = setting?.fileRenderer === FileRenderer.YAML ? 'yaml' : 'json';

            if (variables) {
                const result = variables.map<[string, vscode.FileType.File]>((variable) => {
                    /** format them now by setting */
                    const name    = `${variable.qName}.${prefix}`;
                    const fileUri = uri.with({path: posix.resolve(uri.path, name)});

                    this.fileCache.add(VariableCache, fileUri.toString(), variable.qInfo.qId);
                    return [name, vscode.FileType.File];
                });

                /** this result has to bee saved */
                return result;
            }
        }

        return [];
    }
}
