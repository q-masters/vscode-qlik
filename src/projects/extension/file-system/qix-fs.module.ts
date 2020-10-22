import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";
import * as vscode from "vscode";
import { Routes } from "./data";
import { QixFSProvider } from "./utils/qix-fs.provider";

@singleton()
export class QixFsModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(QixRouter) private router: QixRouter<any>
    ) {}

    public bootstrap(): void {
        this.registerQixFs();
        this.router.addRoutes(Routes);

        /**
         * should be a global file observer for all files not only a single one
         * broadcast this one through who is interested for
         */
        vscode.workspace.onDidChangeTextDocument((e) => {
            /** now we need the last state from server only if it channges the first time */
            console.log(e.document.fileName);

            // is dirty = true if we currently edit this one
            // is dirty false after save or focus the editor again which is more a reload
            console.log(e.document.isDirty);
        });
    }

    /**
     * register qix file system provider to vscode
     */
    private registerQixFs(): void {
        /** register qixfs provider */
        const qixFs = new QixFSProvider();
        this.extensionContext.subscriptions.push(
            vscode.workspace.registerFileSystemProvider('qix', qixFs, { isCaseSensitive: true }));

    }
}
