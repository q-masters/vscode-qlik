import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Connection } from "../../data";

@Component({
    selector: "vsqlik-connection--table-row",
    templateUrl: "table-row.html",
})
export class TableRowComponent {

    @Input()
    public connection: Connection;

    @Output()
    public delete: EventEmitter<Connection>;

    @Output()
    public edit: EventEmitter<Connection>;

    public constructor() {
        this.edit   = new EventEmitter();
        this.delete = new EventEmitter();
    }

    /**
     * connection should be deleted now
     */
    public doDelete() {
        this.delete.emit(this.connection);
    }

    /**
     * connection should be edited now
     */
    public doEdit() {
        this.edit.emit(this.connection);
    }
}
