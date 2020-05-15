import { AuthorizationStrategy } from "../../api";

declare type IteratorResult = [AuthorizationStrategy, (data: any) => any];

export class AuthorizationService {

    /**
     * instance of Authorization Service
     */
    private static instance: AuthorizationService = new AuthorizationService();

    /**
     * all authorization processes runs into an queue
     */
    private authorizationQueueItems: Map<AuthorizationStrategy, (data: any) => any>;

    /**
     * indicator a authorization process is currently running
     */
    private authorizationProcessIsRunning: boolean;

    private constructor() {
        if (AuthorizationService.instance) {
            throw new Error("Use AuthorizationService.getInstance instead");
        }

        this.authorizationQueueItems = new Map();
        this.authorizationProcessIsRunning = false;
    }

    /**
     * get instance of authorization service
     */
    public static getInstance() {
        return this.instance;
    }

    /**
     * run authorization strategy in queue
     */
    public async authorize(strategy: AuthorizationStrategy): Promise<any> {
        return new Promise((resolve) => {
            this.authorizationQueueItems.set(strategy, (data: any) => resolve(data));

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
            await strategy.run();

            callback(strategy.sessionCookies);
            this.authorizationQueueItems.delete(strategy);

            /** grab next entry */
            entry = entries.next();
        }

        this.authorizationProcessIsRunning = false;
    }
}
