import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { EOL } from "os";
import path from "path";
import { Storage } from "./storage";

/**
 * very simple file storage to store data in json
 */
export class FileStorage implements Storage{

    public constructor(
        private directory: string,
        private file: string
    ) {}

    /**
     * get cached data
     */
    public read(key?: string): any
    {
        const data = JSON.parse(readFileSync(this.storage).toString());
        return key ? data[key] : data;
    }

    /**
     * update cached data
     */
    public write(key: string, patch: any)
    {
        const data = this.read();
        data[key] = data[key] ? patch : {...data[key] ?? {}, ...patch};
        writeFileSync(this.storage, JSON.stringify(data) + EOL, {encoding: "utf-8", flag: "w"});
    }

    /**
     * delete from cache
     */
    public delete(key: string)
    {
        const data = this.read();
        if (data[key]) {
            delete data[key];
            writeFileSync(this.storage, JSON.stringify(data) + EOL, {encoding: "utf-8", flag: "w"});
        }
    }

    /**
     * get local storage file and create required directory and file if not exists
     */
    private get storage(): string
    {
        const file = path.resolve(this.directory, this.file);

        if (!existsSync(this.directory)) {
            mkdirSync(this.directory);
        }

        if(!existsSync(file) || !statSync(file).isFile) {
            writeFileSync(file, JSON.stringify({}) + EOL, {encoding: "utf-8",  flag: "w"});
        }

        return file;
    }
}
