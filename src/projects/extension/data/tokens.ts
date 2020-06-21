import { InjectionToken } from "tsyringe";
import * as vscode from "vscode";

export const ExtensionContext: InjectionToken<vscode.ExtensionContext> = "VsCodeExtensionContext";
export const WorkspaceFolders: InjectionToken<string[]> = "VsCodeWorkspaceFolders";
export const SettingsWorkspaceFolder: InjectionToken<string> = "VsCodeSettingsWorkspaceFolders";
