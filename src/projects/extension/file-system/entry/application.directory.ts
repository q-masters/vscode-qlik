import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../data/entry";
import { RouteParam } from "@shared/router/router";
import { ApplicationService } from "@shared/qix/application";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils/registry";
import { inject } from "tsyringe";

export class ApplicationDirectory extends QixFsDirectoryAdapter {

    public constructor(
        @inject(ApplicationService) private appService: ApplicationService,
        workspaceFolderRegistry: WorkspaceFolderRegistry
    ) {
        super(workspaceFolderRegistry);
    }

    /**
     * read directory
     */
    public readDirectory(): [string, vscode.FileType][] {
        return [
            ['script', vscode.FileType.Directory],
            ['variables', vscode.FileType.Directory],
            ['sheets', vscode.FileType.Directory]
        ];
    }

    /**
     * get current stats of application
     */
    async stat(uri: vscode.Uri, params: RouteParam | undefined): Promise<vscode.FileStat> {

        const app = params?.app.split(/\n/)[1];

        if (!app) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const connection = await this.getConnection(uri);
        const isApp      = await this.appService.exists(connection, app);

        if (isApp) {
            return {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 10,
                type: vscode.FileType.Directory
            };
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rename(uri: vscode.Uri, name: string, params?: RouteParam | undefined): void | Promise<void> {
    }
}
