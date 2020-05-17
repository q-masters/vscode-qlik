import { Injectable } from "@angular/core";
import { map, take } from "rxjs/operators";
import { Observable, ReplaySubject } from "rxjs";
import { Connection } from "../data/api";

export declare type BeforeSaveHook = (connection: Connection) => Connection;

@Injectable({providedIn: "root"})
export class ConnectionFormHelper {

    private connection$: ReplaySubject<Connection>;

    private hooks: BeforeSaveHook[] = [];

    public constructor() {
        this.connection$ = new ReplaySubject();
    }

    public get connection(): Observable<Connection> {
        return this.connection$.asObservable();
    }

    public load(connection: Connection) {
        this.connection$.next(connection);
    }

    public unload() {
        this.connection$.next(null);
    }

    /**
     * register on save so we get called if we want to
     * save current connection
     */
    public registerBeforeSave(hook: BeforeSaveHook) {
        if (this.hooks.indexOf(hook) === -1) {
            this.hooks.push(hook);
        }
    }

    /**
     * unregister hook to avoid memory leaks
     */
    public unregisterBeforeSave(source: BeforeSaveHook) {
        this.hooks = this.hooks.filter((hook) => hook !== source);
    }

    /**
     * save current connection but call all hooks before
     */
    public save(): Observable<Connection> {

       return this.connection.pipe(
            take(1),
            map((connection) => {
                this.hooks.forEach((hook) => connection = hook(connection));
                return connection;
            })
       );
    }
}
