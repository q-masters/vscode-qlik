import { AuthorizationStrategy, AuthorizationResult } from "./strategies/authorization.strategy";

export class NoneAuthorizationStrategy extends AuthorizationStrategy {

    public run(): Promise<AuthorizationResult> {
        return Promise.resolve({
            success: true,
            cookies: []
        });
    }
}

export default NoneAuthorizationStrategy;
