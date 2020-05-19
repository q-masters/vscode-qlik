import { SessionCookie, Connection } from "../../../api";

export abstract class AuthorizationStrategy {

    private authTitle = "";

    constructor(
        protected connection: Connection
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
