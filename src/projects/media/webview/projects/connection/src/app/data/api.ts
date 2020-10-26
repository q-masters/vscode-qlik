export enum AuthorizationStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM,
    NONE
}

/**
 * in which format objects should rendered
 * for example variables
 */
export enum FileRenderer {
    JSON,
    YAML
}

export interface FormAuthorizationData {
    domain?: string;
    password?: string;
}

export interface CertificateAuthorizationData {
    /**  */
    path: string;
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

export interface ConnectionSetting {
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
    port?: number;

    /**
     * uses wss if secure is enabled
     */
    secure: boolean;

    /**
     * skip certificate of if wss
     * @example for development
     */
    allowUntrusted: boolean;

    path?: string;

    /**
     * authorization
     */
    authorization: {
        strategy: AuthorizationStrategy,
        data: FormAuthorizationData | CertificateAuthorizationData | unknown
    };
}

export interface DisplaySettings {
    measures: boolean;

    dimensions: boolean;

    script: boolean;

    sheets: boolean;

    variables: boolean;

    visualization: boolean;
}

export interface WorkspaceFolderSetting {

    /**
     *
     */
    label: string;

    /**
     *
     */
    connection: ConnectionSetting;

    display: DisplaySettings;

    /**
     * how should files rendered (yaml, json, ...)
     */
    fileRenderer: FileRenderer;

    /** */
    uid?: string;

    phantom?: boolean;
}
