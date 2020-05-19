import { AuthorizationStrategy } from "./authorization.strategy";

export class NoAuthStrategy extends AuthorizationStrategy {

    run(): Promise<boolean> {
        return Promise.resolve(true);
    }

    sessionCookies = [];
}
