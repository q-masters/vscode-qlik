import * as vscode from "vscode";

export enum TemporaryType {
    APPLICATION,
    SCRIPT
}

/**
 * @todo rewrite to dependencie injection and decorators (very basic)
 */
export abstract class TemporayFileStorage {

    /**
     *
     */
    private static temporaries: Map<string, any> = new Map();

    /**
     *
     */
    public static register<T>(uri: vscode.Uri, data: T) {
        if (!this.temporaries) {
            this.temporaries = new Map();
        }
        this.temporaries.set(uri.toString(), data);
    }

    /**
     *
     */
    public static exists(uri: vscode.Uri) {
        return this.temporaries.has(uri.toString());
    }

    /**
     *
     */
    public static resolve<T>(uri: vscode.Uri): T {
        return this.temporaries.get(uri.toString());
    }

    public static remove(uri: vscode.Uri) {
        this.temporaries.delete(uri.toString());
    }
}
