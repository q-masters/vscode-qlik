import * as vscode from "vscode";
import { Setting, SettingsRepository } from "@utils";
import { SessionToken } from "@data/tokens";

export interface ConnectionSetting extends Setting {
    label: string;
    settings: {
        host: string;
        port: string;
    }
}

/** connection settings */
export const ConnectionSettings = new SessionToken<SettingsRepository<ConnectionSetting>>("VSCode Connection Settings");

export interface ConnectionQuickPickItem extends vscode.QuickPickItem {
    connection: ConnectionSetting
}

export interface WorkspaceFolderScheme {
    uri: vscode.Uri,
    name: string
}
