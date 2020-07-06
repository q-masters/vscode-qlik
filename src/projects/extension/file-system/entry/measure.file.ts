import * as vscode from "vscode";
import { inject, injectable } from "tsyringe";
import { CacheRegistry } from "@shared/utils/cache-registry";
import { QixVariableProvider } from "@shared/qix/utils/variable.provider";
import { WorkspaceFolder } from "@vsqlik/workspace/data/workspace-folder";
import { QixFsFileAdapter } from "../data";
import { FileSystemHelper } from "../utils/file-system.helper";

@injectable()
export class MeasureFile extends QixFsFileAdapter {

    public constructor(
        @inject(QixVariableProvider) private variableProvider: QixVariableProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
        @inject(CacheRegistry) private fileCache: CacheRegistry<WorkspaceFolder>
    ) {
        super();
    }

    /**
     * read variable
     */
    public async readFile(): Promise<Uint8Array> {
        return Buffer.from("not implemented");
    }

    /**
     * get stats of variable
     */
    public async stat(): Promise<vscode.FileStat | void> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.File,
        };
    }
}
