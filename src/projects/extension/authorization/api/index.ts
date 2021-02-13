import { InjectionToken } from "tsyringe";
import { AuthorizationStrategy } from "../strategies/authorization.strategy";
import { Storage } from "@core/storage";

export enum AuthStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM,
    EXTERNAL,
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

export interface SessionState {
    authorized: boolean;
    cookies: string[]
}

export const SessionStorage: InjectionToken<Storage> = Symbol("Storage to save connection settings");
