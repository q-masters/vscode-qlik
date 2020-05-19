import { SessionToken } from "@data/tokens";

declare type R = any;

export class SessionCache {

    private static values: WeakMap<SessionToken<R>, R> = new WeakMap();

    public static add<R>(token: SessionToken<R>, value: R) {
        SessionCache.values.set(token, value);
    }

    public static get<R>(token: SessionToken<R>): R {
        return SessionCache.values.get(token);
    }
}
