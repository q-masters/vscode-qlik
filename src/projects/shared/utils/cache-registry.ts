import { singleton } from "tsyringe";

export class CacheToken {
    constructor(private name: string) {}
}

declare type CacheMap = Map<string, any>;

@singleton()
export class CacheRegistry {

    private registry: WeakMap<CacheToken, CacheMap> = new WeakMap();

    /**
     * register new cache if not exists
     */
    public registerCache(token: CacheToken): void {
        if (!this.registry.has(token)) {
            this.registry.set(token, new Map());
        }
    }

    /**
     * destroy a cache
     */
    public destroyCache(token: CacheToken): void {
        if (!this.registry.has(token)) {
            this.registry.delete(token);
        }
    }

    /**
     * check value exists in cache
     */
    public exists(token: CacheToken, key: string): boolean {
        return !! this.registry.get(token)?.has(key);
    }

    /**
     * add value to cache
     */
    public add(token: CacheToken, key: string, value: any): void {

        if (!this.registry.has(token)) {
            this.registerCache(token);
        }

        const cache = this.registry.get(token);
        cache?.set(key, value);
    }

    public resolve<T extends any>(token: CacheToken, key: string): T | undefined {
        return this.registry.get(token)?.get(key);
    }

    /**
     * delete from specifc cache
     */
    public delete(token: CacheToken, key: string): void {
        const cache = this.registry.get(token);
        cache?.delete(key);
    }
}
