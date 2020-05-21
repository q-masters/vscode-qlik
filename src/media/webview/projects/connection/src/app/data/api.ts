export enum AuthorizationStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM
}

/**
 * in which format objects should rendered
 * for example variables
 */
export enum ObjectRenderStrategy {
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

export interface Connection {
    /**  */
    label: string;

    /**
     * how should objects rendered (yaml, json, ...)
     */
    objectRenderer: ObjectRenderStrategy,

    /** */
    uid?: string;

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
        strategy: AuthorizationStrategy,
        data: FormAuthorizationData | CertificateAuthorizationData | unknown
    }

    phantom?: boolean;
}
