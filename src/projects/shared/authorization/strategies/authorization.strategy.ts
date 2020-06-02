import { ConnectionSetting } from "projects/shared/connection";

export interface AuthorizationStrategyConstructor {
    new(
        connection: ConnectionSetting,
    ): AuthorizationStrategy;
}

export interface AuthorizationResult {
    success: boolean;

    cookies: any[];

    error?: "";
}

export abstract class AuthorizationStrategy {

    private authTitle = "";

    constructor(
        protected connection: ConnectionSetting
    ) { }

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    public abstract run(...args): Promise<AuthorizationResult>;
}
