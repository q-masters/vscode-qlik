import { Injectable } from "@angular/core";
import { map, take } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { WorkspaceFolderSetting, AuthorizationStrategy, FileRenderer } from "../data/api";

export declare type BeforeSaveHook = (connection: WorkspaceFolderSetting) => WorkspaceFolderSetting;

@Injectable({providedIn: "root"})
export class ConnectionFormHelper {

    public get onLoad(): Observable<WorkspaceFolderSetting> {
      return this.connection$.asObservable();
    }

    private connection$: BehaviorSubject<WorkspaceFolderSetting>;

    private hooks: BeforeSaveHook[] = [];

    public constructor() {
        this.connection$ = new BehaviorSubject(this.createEmptyConnection());
    }

    public get connection(): Observable<WorkspaceFolderSetting> {
        return this.connection$.asObservable();
    }

    public load(connection: WorkspaceFolderSetting) {
        /** ensure nothing is missing in our data model */
        const loaded = Object.assign({}, this.createEmptyConnection(), connection);
        this.connection$.next(loaded);
    }

    public unload() {
        this.connection$.next(this.createEmptyConnection());
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
    public save(): Observable<WorkspaceFolderSetting> {

       return this.connection.pipe(
            take(1),
            map((connection) => {
                this.hooks.forEach((hook) => connection = hook(connection));
                return connection;
            })
       );
    }

    /**
     * create only a empty connection
     */
    public createEmptyConnection(): WorkspaceFolderSetting {
        return {
            connection: {
                allowUntrusted: false,
                host: "localhost",
                secure: true,
                path: null,
                port: null,
                authorization: {
                    strategy: AuthorizationStrategy.FORM,
                    data: {
                        domain: null,
                        password: null
                    }
                },
            },
            fileRenderer: FileRenderer.YAML,
            display: {
              measures: true,
              dimensions: true,
              script: true,
              sheets: true,
              variables: true,
              visualization: true
            },
            label: "New Connection"
        };
    }
}
