import * as vscode from "vscode";
import { QixFSProvider, WorkspaceFolderManager, QixRouter, Route } from "./utils";

export class QixFsModule {

    public static bootstrap(context, routes: Route[]) {
    }

    public static destroy() {
        // WorkspaceFolderManager.destroy();
    }
}
