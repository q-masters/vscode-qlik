import * as vscode from "vscode";
import { posix } from "path";
import { container } from "tsyringe";
import { QixRouter } from "@core/router";
import { WorkspaceFolderRegistry } from "../workspace/utils/registry";
import { QixFsDirectory, QixFsFile } from "./entry";

// der brauch ne Map -> URI -> Connection

/** should use enum for this ? */
export namespace QixFsCommands {
    export const DELETE_FILE_COMMAND = `vscodeQlik.qixfs.deleteFileCommand`;
}

/**
 * Qix File System
 *
 * soll das immer mit enigma arbeiten ?
 */
export class QixFSProvider implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    private router: QixRouter<any>;

    private workspaceRegistry: WorkspaceFolderRegistry;

    /**
     * construct new Qix file system
     */
    public constructor() {
        this.emitter           = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile   = this.emitter.event;
        this.router            = container.resolve<QixRouter<any>>(QixRouter);
        this.workspaceRegistry = container.resolve(WorkspaceFolderRegistry);

        // this.qixRouter.addInterceptor(ParamInterceptor);
    }

    watch(): vscode.Disposable {
        return new vscode.Disposable(() => void 0);
    }

    /**
     * return file or directory stats
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {

        // const workspace = this.workspaceRegistry.resolveByUri(uri);

        /** find entry */
        const route = this.router.find(uri.path);
        if(route?.control) {
            // const stats = route.control.stat(uri, route.params);
            return route.control.stat(uri, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * read directory
     */
    async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        const route = this.router.find(uri.path);
        if (route?.control.type === vscode.FileType.Directory) {
            const result = await (route.control as any).readDirectory(uri, route.params);
            return result;
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * create new directory
     */
    async createDirectory(uri: vscode.Uri): Promise<void> {
        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const name      = posix.basename(uri.path);

        const route = this.router.find(parentUri.path);
        if (route?.control.type === vscode.FileType.Directory) {
            return await (route.control as any).createDirectory(uri, name, route.params);
        }

        throw vscode.FileSystemError.FileNotADirectory();
    }

    /**
     * read file
     */
    async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const route = this.router.find(uri.path);
        if (route?.control.type === vscode.FileType.File) {
            return (route.control as any).readFile(uri, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * write file
     */
    async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        const route = this.router.find(uri.path);
        if (route?.control.type === vscode.FileType.File) {
            return (route.control as any).writeFile(uri, content, route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * delete file or directory
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const name      = posix.basename(uri.path);

        const route = this.router.find(parentUri.path);
        if (route?.control.type === vscode.FileType.Directory) {
            return await (route.control as any).delete(uri, name, route.params);
        }

        throw vscode.FileSystemError.FileNotADirectory();
    }

    rename(oldUri: vscode.Uri, newUri: vscode.Uri): void | Thenable<void> {
        const route = this.router.find(oldUri.path);
        if (route?.control.type === vscode.FileType.File) {
            return (route.control as any).rename(oldUri, posix.basename(newUri.path), route.params);
        }
        throw vscode.FileSystemError.FileNotFound();
    }
}
