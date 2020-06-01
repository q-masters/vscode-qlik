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
    password: string;
}

export interface AuthorizationSetting {

    strategy: AuthStrategy;

    data: FormAuthorizationData | unknown;
}
