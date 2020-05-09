import { ConnectionSetting } from "../data";

export interface SessionCookie {
    name: string;
    value: (string | boolean);
}

export abstract class AuthorizationStrategy {

    private authTitle = "";

    constructor(
        protected connectionSetting: ConnectionSetting
    )  { }

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    public abstract run(): Promise<boolean>;

    readonly sessionCookies: SessionCookie[];
}
