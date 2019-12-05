import * as vscode from "vscode";
import { Route, Router, ActivatedRoute } from "../../router";
import { posix } from "path";

export interface Entry {
    name: string;
    type: vscode.FileType;
}

export interface FileEntry extends Entry {
    content: Uint8Array
}

export abstract class QlikConnector {

    private router: Router;

    public constructor(
        routes: Route[],
        private fileSystem: vscode.FileSystemProvider
    ) {
        this.router = Router.getInstance();
        this.router.addRoutes(routes);
    }

    public async exec(uri: vscode.Uri): Promise<[string, vscode.FileType][] | void> {
        const route = this.router.parse(uri);

        if (route) {
            let content: Entry[];
            content = await this.loadContent(route);
            /** register new content in file system */
            const data = content.map<[string, vscode.FileType]>((entry) => {
                return "content" in entry ? this.writeFile(entry, uri) : this.createDirectory(entry, uri);
            });
            return data;
        }
    }

    protected abstract loadContent(data: ActivatedRoute): Promise<Entry[]>;

    /**
     * write file to file system
     */
    private writeFile(entry: FileEntry, parent: vscode.Uri): [string, vscode.FileType] {

        const fileUri = parent.with({path: posix.resolve(parent.path, entry.name) });
        const content = entry.content;
        const options = { create: true, overwrite: true };

        this.fileSystem.writeFile(fileUri, content, options);
        return [entry.name, vscode.FileType.File];
    }

    /**
     * create directory in file system
     */
    private createDirectory(entry: Entry, parent: vscode.Uri): [string, vscode.FileType] {
        const entryPath = posix.resolve(parent.path, entry.name);
        this.fileSystem.createDirectory(parent.with({path: entryPath}));
        return [entry.name, vscode.FileType.Directory];
    }
}
