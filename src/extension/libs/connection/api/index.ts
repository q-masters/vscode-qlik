import * as vscode from "vscode";
import { Setting } from "@utils";

export interface SessionCookie {
    name: string;
    value: (string | boolean);
}

export enum AuthStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM
}

export interface FormAuthorizationData {
    domain?: string;
    username?: string;
    password?: string;
}

export interface CertificateAuthorizationData {
    /**  */
    path: string;
}

export interface Connection extends Setting {

    /**
     * label from connection this will used also as
     * workspace folder name and is uid too
     */
    label: string;

    /**
     * host where to connect
     */
    host: string;

    /**
     * setting port to server
     * ports used by default:
     *
     *  80: if secure is disabled
     * 443: if secure is enabled
     */
    port: number;

    /**
     * uses wss if secure is enabled
     */
    secure: boolean;

    /**
     * skip certificate of if wss
     * @example for development
     */
    allowUntrusted: boolean;

    /**
     * authorization
     */
    authorization: {
        strategy: AuthStrategy,
        data: FormAuthorizationData | CertificateAuthorizationData | unknown
    }
}

export interface ConnectionQuickPickItem extends vscode.QuickPickItem {
    connection: Connection
}

export interface WorkspaceFolderScheme {
    uri: vscode.Uri,
    name: string
}
