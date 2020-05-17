import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { VsCodeConnector } from "@vsqlik/core";
import { Connection, AuthorizationStrategy, Action } from "../../data/api";
import { ConnectionFormHelper } from "../../utils";

enum ViewMode {
    LIST,
    EDIT
}

@Component({
    selector: "vsqlik-connection--root",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, OnDestroy {

    /**
     * hash to hold existing connections
     */
    public connections: Connection[] = [];

    public selectedConnection: Connection;

    public viewMode = ViewMode;

    public currentViewMode: ViewMode = ViewMode.LIST;

    /**
     * component gets destroyed
     */
    private destroy$: Subject<boolean>;

    constructor(
        private vsCodeConnector: VsCodeConnector,
        private connectionFormHelper: ConnectionFormHelper
    ) {
        this.destroy$ = new Subject();
    }

    /** component gets initialized */
    ngOnInit() {
        this.vsCodeConnector.exec({action: Action.List})
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: Connection[]) => this.connections = data);
    }

    /** component gets destroyed */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.connections = [];
        this.destroy$ = null;
    }

    /**
     * stop edit mode
     */
    public cancelEdit() {
        this.currentViewMode = ViewMode.LIST;
        this.connectionFormHelper.unload();
    }

    /**
     * after we edit an connection it should be saved
     */
    public connectionSaved() {
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
        this.connectionFormHelper.load(connection);
        this.currentViewMode = ViewMode.EDIT;
    }

    /** add to list and update */
    public createConnection() {
        const phantomConnection: Connection = {
            label: "New Connection",
            isPhantom: true,
            uid: Math.random().toString(32),
            settings: {
                host: "127.0.0.1",
                port: 443,
                secure: true,
                allowUntrusted: false,
                authorization: {
                    strategy: AuthorizationStrategy.FORM,
                    data: {
                        username: null,
                        password: null,
                        domain: null
                    }
                }
            }
        };
        this.editConnection(phantomConnection);
    }
}
