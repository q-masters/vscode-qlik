import { AuthorizationStrategy, AuthorizationResult } from "@core/authorization";

export class NoneAuthorizationStrategy extends AuthorizationStrategy {

    public run(): Promise<AuthorizationResult> {
        return Promise.resolve({
            success: true,
            cookies: []
        });
    }
}

export default NoneAuthorizationStrategy;
