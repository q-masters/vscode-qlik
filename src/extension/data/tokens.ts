import * as vscode from "vscode";

export class SessionToken<T>  {
    public constructor(private description: string = '') {}
}

export const ExtensionContext   = new SessionToken<vscode.ExtensionContext>("VSCode Extension Context");
export const WorkspaceFolders   = new SessionToken<string[]>("VSCode Connection Settings");
export const ExtensionPath      = new SessionToken<string>("VCode Extension Path");
