import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WorkspaceFolderSetting } from "../../data/api";
import { ConnectionFormHelper } from "../../utils";
import { ConnectionRepository } from "../../utils/connection-repository";

enum ViewMode {
    LIST,
    EDIT
}

@Component({
    selector: "vsqlik-settings--root",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, OnDestroy {

    /**
     * hash to hold existing connections
     */
    public settings: WorkspaceFolderSetting[] = [];

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
                this.settings = data;
            });

        this.connectionRepository.read();
    }

    /** component gets destroyed */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.settings = [];
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
    public onSave(connection: WorkspaceFolderSetting) {
        !connection.uid
            ? this.connectionRepository.add(connection)
            : this.connectionRepository.update(connection);
    }

    /**
     * delete an existing connection
     */
    public deleteSetting(connection: WorkspaceFolderSetting) {
        this.connectionRepository.delete(connection);
    }

    /**
     * sets an connection to edit mode
     */
    public editSetting(connection: WorkspaceFolderSetting) {
        this.connectionFormHelper.load(connection);
        this.currentViewMode = ViewMode.EDIT;
    }

    /** add to list and update */
    public createSetting() {
        const connection = this.connectionFormHelper.createEmptyConnection();
        this.editSetting(connection);
    }
}
