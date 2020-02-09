export interface Connection {
    label: string;
    uid?: string;
    settings: {
        username: string;
        password: string;
        host: string;
        port: number;
        secure: boolean;
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
