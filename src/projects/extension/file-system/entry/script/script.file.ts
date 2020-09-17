import * as vscode from "vscode";
import { inject } from "tsyringe";
import { QixApplicationProvider } from "@shared/qix/utils/application.provider";
import { QixFsFileAdapter } from "../qix/qixfs-entry";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { posix } from "path";
import { EntryType } from "@vsqlik/fs/data";
import { DataNode } from "@core/qix/utils/qix-list.provider";

export class ScriptFile extends QixFsFileAdapter {

    private scriptDeleteTimer: NodeJS.Timeout;

    public constructor(
        @inject(QixApplicationProvider) private appService: QixApplicationProvider,
        @inject(FileSystemHelper) private fileSystemHelper: FileSystemHelper,
    ) {
        super();
    }

    public async stat(uri: vscode.Uri, params: DataNode): Promise<vscode.FileStat> {

        const isTemporary = this.fileSystemHelper.isTemporaryFileEntry(uri);
        const fileName    = params.file;

        if (fileName !== "main.qvs" && !isTemporary) {
            throw vscode.FileSystemError.FileNotFound();
        }

        if (isTemporary) {
            if (this.scriptDeleteTimer) {
                clearTimeout(this.scriptDeleteTimer);
            }
            this.scriptDeleteTimer = setTimeout(() => {
                this.fileSystemHelper.deleteTempoaryFileEntry(uri);
            }, 100);
        }

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
    public async readFile(uri: vscode.Uri): Promise<Uint8Array> {

        if(this.fileSystemHelper.isTemporaryFileEntry(uri)) {
            return Buffer.from("Script was copied successful to main.qvs.");
        }

        const connection = await this.getConnection(uri);
        const app        = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (connection && app) {
            const content = await this.appService.readScript(connection, app.id) ?? "";
            return Buffer.from(content, "utf-8");
        }

        return Buffer.from("could not open app script", "utf-8");
    }

    /**
     * write new content to script
     */
    public async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        let fileUri = uri;

        if (this.isCopy(uri)) {
            this.fileSystemHelper.registerTempoaryFileEntry(uri, content);
            fileUri = this.convertUri(uri);
        }

        const connection = await this.getConnection(uri);
        const app     = connection?.fileSystem.parent(fileUri, EntryType.APPLICATION);

        if (!app || !connection) {
            throw vscode.FileSystemError.FileNotFound();
        }

        await this.appService.writeScript(connection, app.id, content.toString());
        await vscode.commands.executeCommand('VsQlik.Script.CheckSyntax', uri);
    }

    /**
     * if we handle a copy convert the uri to main.qvs
     */
    private convertUri(uri: vscode.Uri): vscode.Uri {
        const parsed = posix.parse(uri.path);
        return uri.with({
            path: posix.resolve(parsed.dir, `main.qvs`)
        });
    }

    private isCopy(uri: vscode.Uri): boolean {
        const parsedUri = posix.parse(uri.toString(true));
        return `${parsedUri.name}${parsedUri.ext}` !== "main.qvs";
    }
}
