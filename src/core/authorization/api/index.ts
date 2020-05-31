export enum AuthStrategy {
    CERTIFICATE,
    FORM,
    CUSTOM
}

export interface AuthorizationData {
    [key: string]: string | number;
}

export interface FormAuthorizationData extends AuthorizationData {
    domain: string;
    username: string;
    password: string;
}
