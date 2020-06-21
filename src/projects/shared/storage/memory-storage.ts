import { Storage } from "./storage";

export class MemoryStorage implements Storage {

    private storage = {};

    // get data from storage
    read(key?: string | undefined) {
        if (key) {
            return this.storage[key];
        }
        return { ...this.storage };
    }

    write(key: string, patch: any) {
        if (this.storage[key]) {
            this.storage[key] = patch;
        }
    }

    delete(key: string) {
        delete this.storage[key];
    }
}
