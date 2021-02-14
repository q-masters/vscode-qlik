import { ConnectionSetting } from "@core/public.api";
import { prototype } from "winston-transport";

export interface AuthorizationStrategyConstructor {
    new(config: ConnectionSetting, url: string, untrusted: boolean): AuthorizationStrategy;
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
        protected url: string,
        protected untrusted = false
    ) { }

    abstract run(): Promise<AuthorizationResult>;
}
