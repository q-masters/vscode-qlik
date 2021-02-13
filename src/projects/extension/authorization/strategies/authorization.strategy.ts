export interface AuthorizationStrategyConstructor {
    new(config: AuthConfig): AuthorizationStrategy;
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

    constructor(protected config: AuthConfig) {
        /*
        const {allowUntrusted, uri, name} = config;
        const {domain, password} = config.credentials;
        strategy.configure({ allowUntrusted, uri, name, domain, password });
        */
    }

    public abstract run(): Promise<AuthorizationResult>;
}
