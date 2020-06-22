import { singleton } from "tsyringe";

export class CacheToken {
    constructor(private name: string) {}
}
declare type CacheMap = Map<string, any>;

@singleton()
export class CacheRegistry<T extends Object> {

    private registry: WeakMap<T, CacheMap> = new WeakMap();

    /**
     * register new cache if not exists
     */
    public registerCache(token: T): void {
        if (!this.registry.has(token)) {
            this.registry.set(token, new Map());
        }
    }

    /**
     * destroy a cache
     */
    public destroyCache(token: T): void {
        if (!this.registry.has(token)) {
            this.registry.delete(token);
        }
    }

    /**
     * check value exists in cache
     */
    public exists(token: T, key: string): boolean {
        return !! this.registry.get(token)?.has(key);
    }

    /**
     * add value to cache
     */
    public add(token: T, key: string, value: any): void {

        if (!token) {
            return;
        }

        if (!this.registry.has(token)) {
            this.registerCache(token);
        }

        const cache = this.registry.get(token);
        cache?.set(key, value);
    }

    public resolve<R extends any>(token: T, key: string): R | undefined {
        return this.registry.get(token)?.get(key);
    }

    /**
     * delete from specifc cache
     */
    public delete(token: T, key: string): void {
        const cache = this.registry.get(token);
        cache?.delete(key);
    }

    public getKeys(token: T): IterableIterator<string> | undefined {
        const cache = this.registry.get(token);
        return cache?.keys();
    }
}
