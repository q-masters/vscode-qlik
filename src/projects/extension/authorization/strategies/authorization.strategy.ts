export interface AuthorizationStrategyConstructor {
    new(): AuthorizationStrategy;
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

    private authConfig: AuthConfig;

    private authUrl: string;

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    set url(uri: string) {
        this.authUrl = uri;
    }

    get url(): string {
        return this.authUrl;
    }

    /**
     *
     *
     */
    set config(config: AuthConfig) {
        this.authConfig = config;
    }

    /**
     *
     *
     */
    get config(): AuthConfig {
        return this.authConfig;
    }


    abstract run(): Promise<AuthorizationResult>;
}
