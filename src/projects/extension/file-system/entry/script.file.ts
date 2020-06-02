import * as vscode from "vscode";
import { QixFsFileAdapter } from "../data/entry";
import { RouteParam } from "@shared/router/router";
import { inject } from "tsyringe";
import { ApplicationService } from "@shared/qix/application";
import { WorkspaceFolderRegistry } from "@vsqlik/workspace/utils";

export class ScriptFile extends QixFsFileAdapter {

    public constructor(
        @inject(ApplicationService) private appService: ApplicationService,
        workspaceFolderRegistry: WorkspaceFolderRegistry
    ) {
        super(workspaceFolderRegistry);
    }

    public async stat(): Promise<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.File,
        };
    }

    /**
     * read contents of the main.qvs
     */
    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {

        const app = params?.app.split(/\n/)[1];

        if (!app) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const connection = await this.getConnection(uri);
        const content = await this.appService.readScript(connection, app) ?? "";

        return Buffer.from(content, "utf-8");
    }

    /**
     * write new content to script
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {

        const app = params?.app.split(/\n/)[1];

        if (!app) {
            throw vscode.FileSystemError.FileNotFound();
        }

        const connection = await this.getConnection(uri);
        await this.appService.writeScript(connection, app, content.toString());
    }
}
