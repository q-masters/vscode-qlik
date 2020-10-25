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
