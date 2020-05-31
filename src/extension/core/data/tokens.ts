import * as vscode from "vscode";
import { InjectionToken } from "tsyringe";

export class SessionToken<T>  {
    public constructor(private description: string = '') {}
}

export const ExtensionContext: InjectionToken<vscode.ExtensionContext> = "vscode extension context";
export const WorkspaceFolders   = new SessionToken<string[]>("VSCode Connection Settings");
