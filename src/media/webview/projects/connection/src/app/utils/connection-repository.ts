import { Injectable } from "@angular/core";
import { VsCodeConnector } from "@vsqlik/core";
import { Observable, BehaviorSubject, zip } from "rxjs";
import { take } from "rxjs/operators";
import { Action, Connection } from "../data/api";

@Injectable({providedIn: "root"})
export class ConnectionRepository {

    private connection$: BehaviorSubject<Connection[]>;

    public constructor(
        private vsCodeConnector: VsCodeConnector,
    ) {
        this.connection$ = new BehaviorSubject([]);
    }

    public get connections(): Observable<Connection[]> {
        return this.connection$.asObservable();
    }

    /**
     * loads all connections
     */
    public read(): void {
        this.vsCodeConnector.exec<Connection[]>({action: Action.List})
            .pipe(take(1))
            .subscribe((data) => this.connection$.next(data));
    }

    /**
     * add a new connection
     */
    public add(connection: Connection) {
        const addCommand = this.vsCodeConnector.exec({action: Action.Create, data: connection});
        zip(this.connection$, addCommand)
            .pipe(take(1))
            .subscribe(([source, added]) => this.connection$.next([...source, added]));
    }

    /**
     * delete an existing connection
     */
    public delete(connection: Connection) {
        const deleteCommand = this.vsCodeConnector.exec({action: Action.Destroy, data: connection});
        zip(this.connection$, deleteCommand)
            .pipe(take(1))
            .subscribe(([source]) => {
                const newConnections = source.filter((current) => current.uid !== connection.uid);
                this.connection$.next(newConnections);
            });
    }

    /**
     * update an existing connection
     */
    public update(connection: Connection) {
        const updateCommand = this.vsCodeConnector.exec({action: Action.Update, data: connection})
        zip(this.connection$, updateCommand)
            .pipe(take(1))
            .subscribe(([source, updated]) => {
                const newConnections = source.map((current) => current.uid === updated.uid ? updated : current);
                this.connection$.next(newConnections);
            });
    }
}
