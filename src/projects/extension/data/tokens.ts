import { container, InjectionToken } from "tsyringe";
import * as vscode from "vscode";
import { Storage } from '@core/storage';
import { VsQlikLogger, VsQlikLoggerResolver, VsQlikLoggerToken } from "../logger/logger";

export const ExtensionContext: InjectionToken<vscode.ExtensionContext> = "VsCodeExtensionContext";
export const WorkspaceFolders: InjectionToken<string[]> = "VsCodeWorkspaceFolders";
export const VsQlikServerSettings: InjectionToken<string> = "VsQlik Server Settings in settings.json file";
export const VsQlikDevSettings: InjectionToken<string> = "VsQlik Developer Settings key in settings.json file";
export const ConnectionStorage: InjectionToken<Storage> = "Storage to save connection settings";
export const QlikOutputChannel: InjectionToken<vscode.OutputChannel> = "Output channel for log informations";
