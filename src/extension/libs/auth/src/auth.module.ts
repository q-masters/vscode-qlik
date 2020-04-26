import * as vscode from "vscode";
import { LoginCommand } from "./commands/src/login.command";

export class AuthModule {

    /**
     * bootstrap settings module
     */
    public static bootstrap() {
        vscode.commands.registerCommand('VSQlik.Authorize.Login', LoginCommand);
    }

    /**
     * connection settings command was triggerd
     */
    private static onConnectionSettingsCommand() {
    }
}
