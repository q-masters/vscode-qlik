import { AuthorizationStrategy, AuthorizationResult } from "./authorization.strategy";

export class NoAuthStrategy extends AuthorizationStrategy {

    run(): Promise<AuthorizationResult> {
        return Promise.resolve({
            success: true,
            cookies: []
        });
    }

    sessionCookies = [];
}
