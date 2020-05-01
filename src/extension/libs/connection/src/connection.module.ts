import * as vscode from "vscode";
import { SessionCache, SettingsRepository } from "@utils";
import { ConnectionSetting, ConnectionSettings } from "./data";
import { ConnectionSettingsWebview } from "./ui";
import { ConnectionCreateCommand } from "./commands";

export class ConnectionModule {

    /**
     * bootstrap settings module
     */
    public static bootstrap() {
        SessionCache.add(ConnectionSettings, new SettingsRepository<ConnectionSetting>('Connection'));

        vscode.commands.registerCommand('VSQlik.Connection.Create'  , ConnectionCreateCommand);
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
