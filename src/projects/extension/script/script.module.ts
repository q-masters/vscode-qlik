import * as vscode from "vscode";
import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";

import { CheckScriptSyntax, ScriptResolveActiveCommand } from "./commands";
import { routes } from "./data/routes";
import { ScriptSynchronizeCommand } from "./commands/sync-script";
import { ScriptCommands } from "./data/commands";
import { ScriptGuard } from "./utils/script.guard";
import { LoadDataProvider } from "./utils/load-data";

@singleton()
export class ScriptModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(QixRouter) private router: QixRouter<any>,
        @inject(ScriptGuard) private scriptGuard: ScriptGuard,
        @inject(LoadDataProvider) private loadDataProvider: LoadDataProvider
    ) {}

    /**
     * bootstrap script module
     */
    public bootstrap(): void {
        this.router.addRoutes(routes);
        this.registerCommands();
        this.scriptGuard.init();

        vscode.commands.executeCommand('setContext', 'VsQlik.Script.DataLoadState', 'idle');
    }

    /**
     * register commands for vscode
     */
    private registerCommands(): void {
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.CHECK_SYNTAX  , CheckScriptSyntax));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.LOAD_DATA     , () => this.onLoadData()));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.STOP_LOAD_DATA, () => this.onStopLoadData()));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.RESOLVE_ACTIVE, ScriptResolveActiveCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.SYNCHRONIZE   , ScriptSynchronizeCommand));
    }

    private async onLoadData() {
        const document = await vscode.commands.executeCommand<vscode.TextDocument>(ScriptCommands.RESOLVE_ACTIVE);
        if (document) {
            vscode.commands.executeCommand('setContext', 'VsQlik.Script.DataLoadState', 'progressing');
            this.loadDataProvider.exec(document);
        }
    }

    private async onStopLoadData() {
        const document = await vscode.commands.executeCommand<vscode.TextDocument>(ScriptCommands.RESOLVE_ACTIVE);
        if (document) {
            this.loadDataProvider.stop();
        }
    }
}
