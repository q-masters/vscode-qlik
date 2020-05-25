import { Cookie, Connection } from "../../../api";

export interface AuthorizationStrategyConstructor {
    new(connection: Connection): AuthorizationStrategy;
}

export interface AuthorizationResult {
    success: boolean;

    cookies: Cookie[],
}

export abstract class AuthorizationStrategy {

    private authTitle = "";

    constructor(
        protected connection: Connection
    ) { }

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    public abstract run(): Promise<AuthorizationResult>;
}
