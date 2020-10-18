import { ExtensionContext } from "@data/tokens";
import * as vscode from "vscode";
import { inject, singleton } from "tsyringe";
import { CheckScriptSyntax, ScriptLoadDataCommand, ScriptResolveActiveCommand } from "./commands";

@singleton()
export class ScriptModule {

    constructor(
        @inject(ExtensionContext) private extensionContext: vscode.ExtensionContext
    ) {}

    public bootstrap(): void {
        this.registerCommands();
        this.registerEvents();
    }

    /**
     * register commands for vscode
     */
    private registerCommands(): void {
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.CheckSyntax', CheckScriptSyntax));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.LoadData', ScriptLoadDataCommand));
        this.extensionContext.subscriptions.push(vscode.commands.registerCommand('VsQlik.Script.ResolveActive', ScriptResolveActiveCommand));
    }

    /**
     * register connection storage where all sessions are saved to
     */
    private registerEvents(): void {
        vscode.workspace.onDidOpenTextDocument((doc: vscode.TextDocument) => {
            if(doc.fileName.match(/\.qvs$/)) {
                vscode.commands.executeCommand(`VsQlik.Script.CheckSyntax`, doc.uri);
            }
        });
    }
}
