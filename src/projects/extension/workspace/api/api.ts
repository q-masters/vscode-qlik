import * as vscode from "vscode";
import { WorkspaceSetting } from "projects/extension/settings/api";

export interface WorkspaceFolderQuickPickItem extends vscode.QuickPickItem {
    setting: WorkspaceSetting
}

export interface WorkspaceFolderScheme {
    uri: vscode.Uri,
    name: string
}
