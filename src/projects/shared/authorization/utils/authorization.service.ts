import { AuthorizationStrategy, AuthorizationResult } from "../strategies/authorization.strategy";
import { singleton } from "tsyringe";

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
    public async authorize(strategy: AuthorizationStrategy): Promise<AuthorizationResult> {

        console.dir(strategy);

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
