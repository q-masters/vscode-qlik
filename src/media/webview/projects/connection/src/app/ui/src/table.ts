import { Component, OnInit, OnDestroy } from "@angular/core";
import { VsCodeConnector } from "@vsqlik/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Connection, Action } from "../../data";
import { TableRowSaveEvent } from "./table-row-edit";

interface VsCodeMessage  {
    command: Action;
    data: Connection | Connection[] | {source: Connection, target: Connection};
}

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
        this.vsCodeConnector.onReciveMessage<VsCodeMessage>()
            .pipe(takeUntil(this.destroy$))
            .subscribe((msg) => this.handleMessage(msg));

        this.vsCodeConnector.exec({command: Action.List});
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
        if (event.old.isPhantom) {
            this.vsCodeConnector.exec({command: Action.Create, data: event.new});
            return;
        }
        this.vsCodeConnector.exec({command: Action.Update, data: event.new});
    }

    /**
     * delete an existing connection
     */
    public deleteConnection(connection: Connection) {
        this.vsCodeConnector.exec({command: Action.Destroy, data: connection});
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

    /**
     * handle messages we recive from vscode
     */
    private handleMessage(message: VsCodeMessage) {
        let data = void 0;

        switch (message.command) {

            case Action.List:
                this.connections = message.data as Connection[];
                break;

            case Action.Destroy:
                data = message.data as Connection;
                this.connections = this.connections.filter((connection) => connection.uid !== data.uid);
                break;

            case Action.Update:
            case Action.Create:
                data = message.data as {source: Connection, target: Connection};
                this.editConnections.delete(data.source);
                this.connections = this.connections.map((connection) => connection.uid === data.source.uid ? data.target : connection);
                break;

            /** update and create */
            default: break;
        }
    }
}
