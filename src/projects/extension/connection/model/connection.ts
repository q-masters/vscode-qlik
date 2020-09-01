import { ConnectionSetting } from "../api";
import WebSocket from "ws";

export enum ConnectionState {
    CLOSED,
    CONNECTING,
    CONNECTED,
    ERROR
}

declare type Cookie = {[key: string]: string};

export class ConnectionModel {

    private connectionCookies: Cookie[] = [];

    private connectionState: ConnectionState = ConnectionState.CLOSED;

    private connectionRequireAuthorization: boolean;

    private connectionIsUntrusted = false;

    private connectionSocket: WebSocket;

    public constructor(
        private connectionSetting: ConnectionSetting
    ) {}

    public set state(state: ConnectionState) {
        this.connectionState = state;
    }

    public get state(): ConnectionState {
        return this.connectionState;
    }

    public get setting(): ConnectionSetting {
        return JSON.parse(JSON.stringify(this.connectionSetting));
    }

    public set isAuthorizationRequired(requireAuth: boolean) {
        this.connectionRequireAuthorization = requireAuth;
    }

    public get isAuthorizationRequired(): boolean {
        return this.connectionRequireAuthorization;
    }

    public set isUntrusted(untrusted: boolean) {
        this.connectionIsUntrusted = untrusted;
    }

    public get isUntrusted(): boolean {
        return this.connectionIsUntrusted;
    }

    /**
     * setter for cookies of current connection
     */
    public set cookies(cookies: Cookie[]) {
        this.connectionCookies = cookies;
    }

    /**
     * cookies of current connection
     */
    public get cookies(): Cookie[] {
        return this.connectionCookies;
    }

    public set socket(sock: WebSocket) {
        this.connectionSocket = sock;
    }

    public get socket(): WebSocket {
        return this.connectionSocket;
    }
}
