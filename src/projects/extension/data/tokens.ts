import { InjectionToken } from "tsyringe";
import * as vscode from "vscode";

export const ExtensionContext: InjectionToken<vscode.ExtensionContext> = "VsCodeExtensionContext";
export const WorkspaceFolders: InjectionToken<string[]> = "VsCodeWorkspaceFolders";
export const VsQlikServerSettings: InjectionToken<string> = "VsQlik Server Settings in settings.json file";
export const VsQlikDevSettings: InjectionToken<string> = "VsQlik Developer Settings key in settings.json file";
