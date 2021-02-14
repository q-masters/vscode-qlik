import { ConnectionSetting } from "@core/public.api";

export interface AuthorizationStrategyConstructor {
    new(config: ConnectionSetting, untrusted: boolean, uri?: string): AuthorizationStrategy;
}

export interface AuthorizationState {
    authorized: boolean;

    loginUri?: string;
}

export interface AuthorizationResult {
    success: boolean;

    cookies: any[];

    error?: "";
}

export interface AuthConfig {

    allowUntrusted: boolean;

    uri: string;

    domain?: string;

    password?: string;

    name: string;
}

export abstract class AuthorizationStrategy {

    private authTitle = "";

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    constructor(
        protected config: ConnectionSetting,
        protected untrusted = false,
        private url?: string
    ) { }

    abstract run(): Promise<AuthorizationResult>;

    get loginUrl(): string {
        return this.url ?? this.resolveServerUrl();
    }

    /**
     * build login url
     *
     */
    protected resolveServerUrl(fromBase = false): string {

        const isSecure = this.config.secure;
        const protocol = isSecure ? 'https://' : 'http://';
        const url = new URL(protocol + this.config.host);

        url.port  = this.config.port?.toString() ?? "";
        url.pathname = this.config.path ?? "";

        return url.toString();
    }
}
