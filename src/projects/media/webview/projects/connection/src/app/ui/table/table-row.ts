import { Component, Input, Output, EventEmitter } from "@angular/core";
import { WorkspaceFolderSetting } from "../../data";

@Component({
    selector: "vsqlik-settings--table-row",
    templateUrl: "table-row.html",
})
export class TableRowComponent {

    @Input()
    public setting: WorkspaceFolderSetting;

    @Output()
    public delete: EventEmitter<WorkspaceFolderSetting>;

    @Output()
    public edit: EventEmitter<WorkspaceFolderSetting>;

    public constructor() {
        this.edit   = new EventEmitter();
        this.delete = new EventEmitter();
    }

    /**
     * connection should be deleted now
     */
    public doDelete() {
        this.delete.emit(this.setting);
    }

    /**
     * connection should be edited now
     */
    public doEdit() {
        this.edit.emit(this.setting);
    }
}
