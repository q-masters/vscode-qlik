export interface SessionCookie {
    name: string;
    value: string | boolean;
}

export interface AuthService {

    authorize(uri: string): Promise<boolean>;

    logout(): Promise<boolean>;

    readonly sessionCookies: SessionCookie[];
}
