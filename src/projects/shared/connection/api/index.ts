import { AuthorizationSetting } from "projects/shared/authorization/api";

/** connection settings */
export interface ConnectionSetting {

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port?: number;

    /**
     * additional path (proxy)
     */
    path: string;

    /**
     * secure connection
     */
    secure: boolean;

    /**
     * for self signed certificates
     */
    allowUntrusted: boolean;

    /**
     * authorization settings
     */
    authorization: AuthorizationSetting<any>;
}

export interface ConnectionData extends ConnectionSetting {
    cookies: any[];
}

export interface DisplaySettings {
    dimensions: boolean;
    measures: boolean;
    script: boolean;
    sheets: boolean;
    variables: boolean;
}
