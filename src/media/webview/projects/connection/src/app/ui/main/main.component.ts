import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Connection } from "../../data/api";
import { ConnectionFormHelper } from "../../utils";
import { ConnectionRepository } from "../../utils/connection-repository";

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
        private connectionRepository: ConnectionRepository,
        private connectionFormHelper: ConnectionFormHelper
    ) {
        this.destroy$ = new Subject();
    }

    /** component gets initialized */
    ngOnInit() {

        this.connectionRepository.connections
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.currentViewMode = ViewMode.LIST;
                this.connections = data;
            });

        this.connectionRepository.read();
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
    public onSave(connection: Connection) {
        !connection.uid
            ? this.connectionRepository.add(connection)
            : this.connectionRepository.update(connection);
    }

    /**
     * delete an existing connection
     */
    public deleteConnection(connection: Connection) {
        this.connectionRepository.delete(connection);
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
        const connection = this.connectionFormHelper.createEmptyConnection();
        this.editConnection(connection);
    }
}
