import { ConnectionSetting } from "../data";

export interface SessionCookie {
    name: string;
    value: string | boolean;
}

export abstract class AuthorizationStrategy {

    constructor(
        protected connectionSetting: ConnectionSetting
    ) { }

    public abstract run(): Promise<boolean>;

    readonly sessionCookies: SessionCookie[];
}
