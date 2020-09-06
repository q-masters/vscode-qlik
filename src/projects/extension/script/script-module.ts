import * as vscode from "vscode";
import { ScriptLoadDataCommand } from "./commands/load-data";
import { ScriptCheckSyntaxCommand } from "./commands/check-script-syntax";
import { ScriptResolveActiveCommand } from "./commands/active-script";
import { ScriptStartLanguageServerCommand } from "./commands/start-language-server";
import { LanguageClient } from 'vscode-languageclient';

export class ScriptModule {

    private static client: LanguageClient;

    public static bootstrap(): void {
        this.regiterEvents();
        this.registerCommands();
        this.startLanguageServer();
    }

    public static destroy(): void {
        this.client.stop();
    }

    private static regiterEvents(): void {
        vscode.workspace.onDidSaveTextDocument((doc) => vscode.commands.executeCommand('VsQlik.Script.CheckSyntax'));
        vscode.workspace.onDidOpenTextDocument((doc) => vscode.commands.executeCommand('VsQlik.Script.CheckSyntax'));
    }

    private static registerCommands(): void {
        vscode.commands.registerTextEditorCommand('VsQlik.Script.ResolveActive', ScriptResolveActiveCommand);
        vscode.commands.registerTextEditorCommand('VsQlik.Script.CheckSyntax', ScriptCheckSyntaxCommand);
        vscode.commands.registerTextEditorCommand('VsQlik.Script.LoadData',  ScriptLoadDataCommand);
    }

    private static startLanguageServer() {
        this.client = ScriptStartLanguageServerCommand();
    }
}
