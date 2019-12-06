import * as vscode from "vscode";
import { Route, Router, ActivatedRoute } from "../../router";

export interface Entry {
    name: string;
    type: vscode.FileType;
}

export interface FileEntry extends Entry {
    content: Uint8Array
}

export abstract class QlikConnector {

    private router: Router;

    private fsProvider;

    public constructor(
        routes: Route[],
    ) {
        this.router = Router.getInstance();
        this.router.addRoutes(routes);
    }

    public set fileSystemProvider(provider) {
        this.fsProvider = provider;
    }

    public async exec(uri: vscode.Uri): Promise<any> {
        const route = this.router.parse(uri);

        if (route) {
            return await this.routeActivated(route);
        }
    }

    protected abstract routeActivated(route: ActivatedRoute): Promise<any>;
}
