import * as vscode from "vscode";
import { QixFSProvider, WorkspaceFolderManager, QixRouter, Route } from "./utils";

export class QixFsModule {

    public static bootstrap(context, routes: Route[]) {
        WorkspaceFolderManager.addFolder(vscode.workspace.workspaceFolders || []);
        QixRouter.addRoutes(routes);

        const qixFs  = new QixFSProvider();
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));

        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            WorkspaceFolderManager.addFolder(event.added);
            WorkspaceFolderManager.removeFolder(event.removed);
        });
    }

    public static destroy() {
        // WorkspaceFolderManager.destroy();
    }
}
