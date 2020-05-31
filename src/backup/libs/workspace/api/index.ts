import * as vscode from "vscode";
import { ConnectionSetting } from "backup/libs/settings/api";

export interface WorkspaceFolderQuickPickItem extends vscode.QuickPickItem {
    connection: ConnectionSetting
}

export interface WorkspaceFolderScheme {
    uri: vscode.Uri,
    name: string
}
