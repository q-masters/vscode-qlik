import { AuthorizationResult, AuthorizationStrategy, AuthorizationStrategyConstructor } from "../strategies/authorization.strategy";
import { inject, singleton } from "tsyringe";
import { Storage } from "@core/storage";
import { AuthStrategy, SessionStorage } from "../api";
import FormAuthorizationStrategy from "../strategies/form";
import ExternalAuthorizationStrategy from "../strategies/external";
import { ConnectionSetting } from "@core/public.api";
import { SessionState } from "http2";

@singleton()
export class AuthorizationService {

    /**
     * all authorization processes runs into an queue
     *
     */
    private authorizationQueueItems: Map<AuthorizationStrategy, (data: any) => any>;

    /**
     * indicator a authorization process is currently running
     *
     */
    private authorizationProcessIsRunning: boolean;

    /**
     *
     *
     */
    constructor(
        @inject(SessionStorage) private sessionStorage: Storage
    ) {
        this.authorizationQueueItems = new Map();
        this.authorizationProcessIsRunning = false;
    }

    /**
     *
     *
     */
    async login(config: ConnectionSetting, uri?: string, untrusted = false): Promise<AuthorizationResult> {

        if (!config) {
            // log message no configuration found should not be possible but u know
            return {
                success: false,
                cookies: []
            };
        }

        const strategy = this.resolveAuthorizationStrategy(config);

        return new Promise((resolve) => {
            this.authorizationQueueItems.set(new strategy(config, untrusted, uri), (result: AuthorizationResult) => {
                if (result.success) {
                    this.sessionStorage.write(JSON.stringify(config), {
                        authorized: true,
                        cookies: result.cookies
                    });
                }

                resolve({
                    success: result.success,
                    cookies: result.cookies
                });
            });

            if (!this.authorizationProcessIsRunning) {
                this.runAuthorization();
            }
        });
    }

    /**
     * session data
     *
     */
    resolveSession(setting: ConnectionSetting): SessionState | undefined {
        const key = JSON.stringify(setting);
        return this.sessionStorage.read(key);
    }

    /**
     * resolve authorization strategy
     *
     */
    private resolveAuthorizationStrategy(config: ConnectionSetting): AuthorizationStrategyConstructor {

        const strategy = config.authorization.strategy;

        switch (strategy) {
            case AuthStrategy.FORM:
                return FormAuthorizationStrategy;

            case AuthStrategy.EXTERNAL:
                return ExternalAuthorizationStrategy;
        }

        throw new Error('Could not resolve Authorization strategy');
    }

    /**
     * runs authorization
     *
     */
    private async runAuthorization() {
        this.authorizationProcessIsRunning = true;

        const entries = this.authorizationQueueItems.entries();
        let entry     = entries.next();

        while (!entry.done) {
            const [strategy, callback] = entry.value;
            const result = await strategy.run();

            callback(result);
            this.authorizationQueueItems.delete(strategy);

            /** grab next entry */
            entry = entries.next();
        }
        this.authorizationProcessIsRunning = false;
    }
}
