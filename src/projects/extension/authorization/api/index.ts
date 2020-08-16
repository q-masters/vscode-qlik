import { AuthorizationStrategy } from "../strategies/authorization.strategy";

export enum AuthStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM,
    NONE
}

export interface AuthorizationData {
    [key: string]: string | number;
}

export interface FormAuthorizationData extends AuthorizationData {

    domain: string;

    password: string;
}

export interface AuthorizationSetting {

    strategy: AuthStrategy;

    data: {
        domain: string;
        password: string;
    }
}

export interface Authorization {
    strategy: AuthorizationStrategy;
}

export interface LoginCredentials {
    domain?: string,
    password?: string
}
