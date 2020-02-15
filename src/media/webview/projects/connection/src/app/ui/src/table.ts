import { Component, OnInit, OnDestroy } from "@angular/core";
import { VsCodeConnector } from "@vsqlik/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Connection, Action } from "../../data";
import { TableRowSaveEvent } from "./table-row-edit";

@Component({
    selector: "vsqlik-connection--table",
    templateUrl: "table.html",
    styleUrls: ["./table.scss"]
})
export class TableComponent implements OnInit, OnDestroy {

    /**
     * hash to hold existing connections
     */
    public connections: Connection[] = [];

    /**
     * component gets destroyed
     */
    private destroy$: Subject<boolean>;

    /**
     * weakset where all connections will be added which are currently
     * in edit mode
     */
    private editConnections: WeakSet<Connection>;

    constructor(
        private vsCodeConnector: VsCodeConnector
    ) {
        this.editConnections = new WeakSet();
        this.destroy$ = new Subject();
    }

    /** component gets initialized */
    ngOnInit() {
        this.vsCodeConnector.exec({action: Action.List})
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Connection[]) => {
                this.connections = data;
            });
    }

    /** component gets destroyed */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.connections = [];
        this.destroy$ = null;
    }

    /**
     * check connection is in edit mode
     */
    public isEditMode(connection: Connection): boolean {
        return this.editConnections.has(connection);
    }

    /**
     * stop edit mode
     */
    public cancelEdit(connection: Connection) {
        if (connection.isPhantom) {
            this.connections = this.connections.filter((con) => con !== connection);
        }
        this.editConnections.delete(connection);
    }

    /**
     * after we edit an connection it should be saved
     */
    public saveConnection(event: TableRowSaveEvent) {
        const request = event.old.isPhantom
            ? this.vsCodeConnector.exec({action: Action.Create, data: event.new})
            : this.vsCodeConnector.exec({action: Action.Update, data: event.new});

        request
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
                this.editConnections.delete(event.old);
                this.connections = this.connections.map((connection) => connection.uid === event.old.uid ? response : connection);
            });
    }

    /**
     * delete an existing connection
     */
    public deleteConnection(connection: Connection) {
        this.vsCodeConnector.exec({action: Action.Destroy, data: connection})
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                 this.connections = this.connections.filter((_) => _.uid !== connection.uid);
            });
    }

    /**
     * sets an connection to edit mode
     */
    public editConnection(connection: Connection) {
        this.editConnections.add(connection);
    }

    /** add to list and update */
    public createConnection() {
        const phantomConnection: Connection = {
            label: "New Connection",
            isPhantom: true,
            uid: Math.random().toString(32),
            settings: {
                host: "127.0.0.1",
                password: "",
                port: 9076,
                secure: true,
                username: ""
            }
        };
        this.editConnection(phantomConnection);
        this.connections.push(phantomConnection);
    }
}
