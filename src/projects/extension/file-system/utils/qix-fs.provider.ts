import * as vscode from "vscode";
import { posix } from "path";
import { container, singleton } from "tsyringe";
import { QixRouter } from "projects/shared/router";
import { setTimeout } from "timers";

/**
 * Qix File System
 *
 * soll das immer mit enigma arbeiten ?
 */
@singleton()
export class QixFSProvider implements vscode.FileSystemProvider {

    public readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]>;

    private emitter: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    private router: QixRouter<any>;

    /**
     * construct new Qix file system
     */
    public constructor() {
        this.emitter           = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
        this.onDidChangeFile   = this.emitter.event;
        this.router            = container.resolve<QixRouter<any>>(QixRouter);
        this.registerCommands();
    }

    watch(): vscode.Disposable {
        return new vscode.Disposable(() => void 0);
    }

    /**
     * return file or directory stats
     */
    stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
        /** find entry */
        const route = this.router.find(uri.path);
        if(route?.control) {
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
            await (route.control as any).writeFile(uri, content, route.params);
            this.emitter.fire([
                { type: vscode.FileChangeType.Created, uri },
                { type: vscode.FileChangeType.Changed, uri }
            ]);
            return;
        }
        throw vscode.FileSystemError.FileNotFound();
    }

    /**
     * delete file or directory
     */
    public async delete(uri: vscode.Uri): Promise<void> {

        const parentUri = uri.with({path: posix.dirname(uri.path)});
        const route = this.router.find(parentUri.path);

        if (route?.control.type === vscode.FileType.Directory) {
            await (route.control as any).delete(uri, route.params);

            const dirname = uri.with({ path: posix.dirname(uri.path) });
            setTimeout(() => {
                this.emitter.fire([
                    { type: vscode.FileChangeType.Changed, uri: dirname },
                    { uri, type: vscode.FileChangeType.Deleted }
                ]);
            }, 10);

            return;
        }
        throw vscode.FileSystemError.FileNotADirectory();
    }

    /**
     * rename or move a file, this is bascicly the same for vscode
     *
     * if source directory === target directory we only renamed a file or directory
     * otherwise we have to do a move operation
     */
    public rename(oldUri: vscode.Uri, newUri: vscode.Uri): void | Thenable<void> {

        const route = this.router.find(oldUri.path);
        if (route) {

            const source = posix.parse(oldUri.toString(true)).dir;
            const target = posix.parse(newUri.toString(true)).dir;

            return source !== target
                ? (route.control as any).move(oldUri, newUri, route.params)
                : (route.control as any).rename(oldUri, newUri, route.params);
        }

        throw vscode.FileSystemError.FileNotFound();
    }

    public reloadFile(uri: vscode.Uri): void {
        this.emitter.fire([{ uri, type: vscode.FileChangeType.Changed }]);
    }

    /**
     * register internal commands
     */
    private registerCommands() {
        vscode.commands.registerCommand("vsqlik.qixfs.delete", (uri: vscode.Uri) => this.delete(uri));
    }
}
