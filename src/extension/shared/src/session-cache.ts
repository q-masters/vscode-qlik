import * as vscode from "vscode";

declare type R = any;

class SessionToken<T>  {
    public constructor(private description: string = '') {}
}

export const ExtensionContext = new SessionToken<vscode.ExtensionContext>("VSCode Extension Context");

export class SessionCache {

    private static values: WeakMap<SessionToken<R>, R> = new WeakMap();

    public static add<R>(token: SessionToken<R>, value: R) {
        SessionCache.values.set(token, value);
    }

    public static get<R>(token: SessionToken<R>): R {
        return SessionCache.values.get(token);
    }
}
