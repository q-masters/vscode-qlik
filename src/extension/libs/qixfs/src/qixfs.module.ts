import * as vscode from "vscode";
import { QixFSProvider, WorkspaceFolderManager, QixRouter, Route } from "./utils";

export class QixFsModule {

    public static bootstrap(context, routes: Route[]) {

        WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
        QixRouter.addRoutes(routes);

        const qixFs  = new QixFSProvider();
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));
    }

}
