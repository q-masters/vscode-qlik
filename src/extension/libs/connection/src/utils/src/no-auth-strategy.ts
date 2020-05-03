import { AuthorizationStrategy } from "../../api";

export class NoAuthStrategy extends AuthorizationStrategy {

    run(): Promise<boolean> {
        return Promise.resolve(true);
    }

    sessionCookies = [];
}
