/** connection settings */
export interface ConnectionSetting {

    /**
     * session cookies
     */
    cookies: Array<{[key: string]: string}>;

    /**
     * host name
     */
    host: string;

    /**
     * only if a custom port is set, by default this is
     * 80 / 443
     */
    port: number;

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

    authorization: {
        data: AuthorizationData;
        strategy: AuthStrategy;
    }
}