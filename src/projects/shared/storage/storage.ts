export interface Storage {

    read(key?: string);

    /**
     * update cached data
     */
    write(key: string, patch: any);

    /**
     * delete from cache
     */
    delete(key: string);
}
