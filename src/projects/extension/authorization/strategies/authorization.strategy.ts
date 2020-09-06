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

    protected config: AuthConfig;

    private authTitle = "";

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    public configure(config: AuthConfig): void {
        this.config = config;
    }

    public abstract run(): Promise<AuthorizationResult>;
}
