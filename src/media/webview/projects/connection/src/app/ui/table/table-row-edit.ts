import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Connection } from "../../data";

export interface TableRowSaveEvent {
    new: Connection;
    old: Connection;
}

@Component({
    selector: "vsqlik-connection--table-row-edit",
    templateUrl: "table-row-edit.html"
})
export class TableRowEditComponent implements OnInit {

    @Input()
    public connection: Connection;

    @Output()
    public save: EventEmitter<TableRowSaveEvent>;

    @Output()
    public cancel: EventEmitter<Connection>;

    public isSecure = false;

    public allowUntrusted = false;

    public constructor(
        private formBuilder: FormBuilder
    ) {
        this.save   = new EventEmitter();
        this.cancel = new EventEmitter();
    }

    public connectionForm: FormGroup;

    ngOnInit() {
        this.isSecure = this.connection?.settings.secure ?? true;

        const label  = this.formBuilder.control(this.connection?.label           || "");
        const host   = this.formBuilder.control(this.connection?.settings.host   || "");
        const port   = this.formBuilder.control(this.connection?.settings.port   || "");
        const secure = this.formBuilder.control(this.isSecure);
        const untrusted = this.formBuilder.control(this.allowUntrusted);
        secure.valueChanges.subscribe((value) => this.isSecure = value);

        this.connectionForm = this.formBuilder.group({label, host, port, secure, untrusted});

        secure.valueChanges.subscribe((value: boolean) => {
            untrusted.setValue(false);
            value ? untrusted.enable() : untrusted.disable();
        });
    }

    public doSave() {
        const values = this.connectionForm.getRawValue();
        const newSettings = {
            host: values.host,
            port: parseInt(values.port, 10),
            secure: values.secure,
            allowUntrusted: values.untrusted
        };

        const newData = {
            label: values.label,
            settings: newSettings
        };

        const updated = Object.assign({}, this.connection, newData);

        JSON.stringify(this.connection) !== JSON.stringify(updated)
            ? this.saveConnection(updated)
            : this.doCancel();
    }

    public doCancel() {
        this.connectionForm.disable();
        this.cancel.emit(this.connection);
    }

    @HostListener("keydown", ["$event"])
    protected handleKeyDownEvent(event: KeyboardEvent) {
        event.stopPropagation();

        if (event.key === "Enter") {
            this.doSave();
        }
    }

    private saveConnection(connection: Connection) {
        delete connection.isPhantom;
        this.save.emit({new: connection, old: this.connection});
    }
}
