import { SessionCookie } from "../../../api";
import { ConnectionSetting } from "../../../data";

export abstract class AuthorizationStrategy {

    private authTitle = "";

    constructor(
        protected connectionSetting: ConnectionSetting
    ) { }

    public set title(title: string) {
        this.authTitle = title;
    }

    public get title(): string {
        return this.authTitle;
    }

    public abstract run(): Promise<boolean>;

    readonly sessionCookies: SessionCookie[];
}
