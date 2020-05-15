export interface Connection {
    label: string;
    uid?: string;
    settings: {
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
    };
    isPhantom?: boolean;
}

/**
 * action commands which are send to vscode
 */
export enum Action {
    Create  = "create",
    List    = "read",
    Update  = "update",
    Destroy = "destroy",
    Error   = "error"
}
