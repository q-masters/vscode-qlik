import * as vscode from "vscode";
import { Route, Router, ActivatedRoute } from "../../router";
import { posix } from "path";

export interface QlikApp {

    id: string;

    name: string;

    script: string;
}

export interface RouteConfig {
    path: string;
    action?: string;
    provider?: any;
    children?: RouteConfig[];
}

export abstract class QlikConnector {

    private router: Router;

    public constructor(routes: Route[]) {
        this.router = Router.getInstance();
        this.router.addRoutes(routes);
    }

    public async exec(uri: vscode.Uri, fs: vscode.FileSystemProvider): Promise<[string, vscode.FileType][] | void> {
        const route = this.router.parse(uri);
        if (route) {
            const content = await this.loadContent(route);

            /** register new content in file system */
            content.forEach((entry) => {
                const entryPath = posix.resolve(uri.path, entry[0]);
                fs.createDirectory(uri.with({path: entryPath}));
            });

            return content;
        }
    }

    protected abstract loadContent(data: ActivatedRoute): Promise<[string, vscode.FileType][]>;
}
