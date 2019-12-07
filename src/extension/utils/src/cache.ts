export class Cache {

    private static instance: Cache = new Cache();

    private cached: Map<string, any>;

    public static getInstance(): Cache {
        return this.instance;
    }

    private constructor() {
        if (Cache.instance) {
            throw new Error("could not create instance use Cache.getInstance() instead");
        }
        this.cached = new Map();
    }

    public has(key: string): boolean {
        return this.cached.has(key);
    }

    public get<T>(key: string): T {
        return this.cached.get(key) as T;
    }

    public delete(key: string): boolean {
        if (this.has(key)) {
            return this.cached.delete(key);
        }
        return false;
    }

    public set<T>(key: string, value: T) {
        this.cached.set(key, value);
    }
}