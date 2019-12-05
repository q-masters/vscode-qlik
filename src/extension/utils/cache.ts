
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
 * convert method param and add this to cache key for CacheAble
 * 
 * @example
 * 
 * export class CloneFactory {
 * 
 *     @CacheAble()
 *     public creat(@cacheKey name: string): Person {
 *        return new Person(name);
 *     }
 * }
 * 
 * const cloneFactory = new CloneFactory();
 * const sheep1 = cloneFactory.create("Dolly");
 * const sheep2 = cloneFactory.create("Dolly");
 * 
 * console.log(sheep1 === sheep2); // emits true
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
