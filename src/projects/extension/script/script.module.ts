import * as vscode from "vscode";
import { QixRouter } from "@core/router";
import { ExtensionContext } from "@data/tokens";
import { inject, singleton } from "tsyringe";

import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";
import { routes } from "./data/routes";
import { ScriptSynchronizeCommand } from "./commands/sync-script";
import { ScriptCommands } from "./data/commands";
import { ScriptGuard } from "./utils/script.guard";

@singleton()
export class ScriptModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext,
        @inject(QixRouter) private router: QixRouter<any>,
        @inject(ScriptGuard) private scriptGuard: ScriptGuard
    ) {
    }

    /**
     * bootstrap script module
     */
    public bootstrap(): void {
        this.router.addRoutes(routes);
        this.registerCommands();
        this.scriptGuard.init();
    }

    /**
     * register commands for vscode
     */
    private registerCommands(): void {
        /** @todo move to enum */
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.CHECK_SYNTAX  , CheckScriptSyntax));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.LOAD_DATA     , ScriptLoadDataCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.RESOLVE_ACTIVE, ScriptResolveActiveCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand(ScriptCommands.SYNCHRONIZE   , ScriptSynchronizeCommand));
    }
}
