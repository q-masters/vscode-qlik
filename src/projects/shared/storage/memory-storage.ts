import { Storage } from "./storage";

export class MemoryStorage<T> implements Storage {

    private storage: Object = {};

    public get data(): {[key: string]: T} {
        return JSON.parse(JSON.stringify(this.storage));
    }

    // get data from storage
    read(key: string | undefined): T | undefined {
        if (key) {
            return this.storage[key];
        }
    }

    write(key: string, data: T) {
        this.storage[key] = data;
    }

    delete(key: string) {
        delete this.storage[key];
    }

    clear() {
        this.storage = {};
    }

    exists(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.storage, key);
    }
}
