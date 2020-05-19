import * as vscode from "vscode";
import { SessionCache, SettingsRepository } from "@utils";
import { CONNECTION_REPOSITORY } from "./data";
import { ConnectionSettingsWebview } from "./ui";
import { CreateWorkspaceFolder } from "./commands";
import { Connection } from "./api";

export class ConnectionModule {
    /**
     * bootstrap settings module
     */
    public static bootstrap() {
        SessionCache.add(CONNECTION_REPOSITORY, new SettingsRepository<Connection>('Connection'));

        vscode.commands.registerCommand('VSQlik.Connection.Create'  , CreateWorkspaceFolder);
        vscode.commands.registerCommand('VSQlik.Connection.Settings', this.onConnectionSettingsCommand);
    }

    /**
     * connection settings command was triggerd
     */
    private static onConnectionSettingsCommand() {
        const view = new ConnectionSettingsWebview();
        view.render('VsQlik.Connection.Settings', 'VsQlik Connection Settings');
    }
}
