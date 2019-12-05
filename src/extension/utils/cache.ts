
const MemoryCache: Map<string, any> = new Map();

/**
 * Simple MemoryCache
 * 
 * @example
 * 
 * @CacheAble()
 * public getSession() {
 * }
 */
export function CacheAble() {

    function argumentToString(arg): string {
        if (!arg) {
            return "";
        }
        return arg;
    }

    return (target, name, descriptor) => {

        const originalFn = descriptor.value;
        const metadataKey = `__log_${name}_parameters__`;

        descriptor.value = function (...args: any) {

            let cacheToken = `${target.constructor.name}_${name}`;

            if(target[metadataKey]) {
                const indicies: number[] = target[metadataKey];
                const data = indicies.reduce((value, index) => {
                    return value.concat("_", argumentToString(args[index]));
                }, "");
                cacheToken = cacheToken.concat(data);
            }

            if (!MemoryCache.has(cacheToken)) {
                const valueToCache = originalFn.apply(this, args);
                MemoryCache.set(cacheToken, valueToCache);
            }

            return MemoryCache.get(cacheToken);
        }

        return descriptor;
    }
}

/**
 * convert method param to cache key
 * 
 * by default 
 * 
 * @CacheAble will use class constructor name, method name as key for cache
 * sometimes it is not enough since we want not cache simply all
 * 
 * @example
 * 
 * @CacheAble()
 * public getPerson(@cacheKey name: string) {
 * }
 * 
 * const cloneFactory = new CloneFactory();
 * // add value to memory cache with key CloneFactory_getPerson_CloneWarrior
 * cloneFactory.human("CloneWarrior");
 * 
 * // value now comes from cache since key CloneFactory_getPerson_CloneWarrior allready exists
 * cloneFactory.human("CloneWarrior");
 */
export function cacheKey(target: any, key: string, index: number) {

    var metadataKey = `__log_${key}_parameters__`;

    if (Array.isArray(target[metadataKey])) {
      target[metadataKey].push(index);
    }
    else {
        Object.defineProperty(target, metadataKey, {
            enumerable: false,
            configurable: false,
            value: [index]
        });
    }
}
