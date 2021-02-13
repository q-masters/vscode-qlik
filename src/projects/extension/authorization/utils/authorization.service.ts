import { AuthorizationResult, AuthorizationStrategy } from "../strategies/authorization.strategy";
import { singleton } from "tsyringe";
import { AuthStrategy } from "@auth/api";
import FormAuthorizationStrategy from "@auth/strategies/form";
import ExternalAuthorizationStrategy from "@auth/strategies/external";
import { DataNode } from "@core/qix/utils/qix-list.provider";

@singleton()
export class AuthorizationService {

    /**
     * all authorization processes runs into an queue
     */
    private authorizationQueueItems: Map<AuthorizationStrategy, (data: any) => any>;

    /**
     * indicator a authorization process is currently running
     */
    private authorizationProcessIsRunning: boolean;

    public constructor() {
        this.authorizationQueueItems = new Map();
        this.authorizationProcessIsRunning = false;
    }

    /**
     * run authorization strategy in queue
     */
    public async authorize(config: DataNode): Promise<AuthorizationResult> {
        const strategy = this.resolveAuthorizationStrategy(config);
        return new Promise((resolve) => {
            this.authorizationQueueItems.set(strategy, (result: AuthorizationResult) => {
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

    private resolveAuthorizationStrategy(config: any): AuthorizationStrategy {
        let strategy: AuthorizationStrategy | undefined = void 0;

        switch (config.strategy) {
            case AuthStrategy.FORM:
                strategy = new FormAuthorizationStrategy(config);
                break;

            case AuthStrategy.EXTERNAL:
                strategy = new ExternalAuthorizationStrategy(config);
                break;
        }

        if (strategy) {
            return strategy;
        }

        throw new Error('Could not resolve Authorization strategy');
    }

    /**
     * runs authorization
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
