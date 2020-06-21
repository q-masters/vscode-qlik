import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { WorkspaceFolderSetting } from "../../data";

export interface TableRowSaveEvent {
    new: WorkspaceFolderSetting;
    old: WorkspaceFolderSetting;
}

@Component({
    selector: "vsqlik-WorkspaceFolderSetting--table-row-edit",
    templateUrl: "table-row-edit.html"
})
export class TableRowEditComponent implements OnInit {

    @Input()
    public workspaceFolderSetting: WorkspaceFolderSetting;

    @Output()
    public save: EventEmitter<TableRowSaveEvent>;

    @Output()
    public cancel: EventEmitter<WorkspaceFolderSetting>;

    public isSecure = false;

    public allowUntrusted = false;

    public connectionSettingForm: FormGroup;

    public workspaceFolderSettingForm: FormGroup;

    public constructor(
        private formBuilder: FormBuilder
    ) {
        this.save   = new EventEmitter();
        this.cancel = new EventEmitter();
    }


    ngOnInit() {
        this.isSecure = this.workspaceFolderSetting?.connection.secure ?? true;

        const label     = this.formBuilder.control(this.workspaceFolderSetting?.label           || "");
        const host      = this.formBuilder.control(this.workspaceFolderSetting?.connection.host   || "");
        const port      = this.formBuilder.control(this.workspaceFolderSetting?.connection.port   || "");
        const secure    = this.formBuilder.control(this.workspaceFolderSetting?.connection.secure);
        const untrusted = this.formBuilder.control(this.workspaceFolderSetting.connection.allowUntrusted);

        secure.valueChanges.subscribe((value) => this.isSecure = value);

        this.connectionSettingForm      = this.formBuilder.group({host, port, secure, untrusted});

        this.workspaceFolderSettingForm = this.formBuilder.group({label, connection: this.connectionSettingForm});

        secure.valueChanges.subscribe((value: boolean) => {
            untrusted.setValue(false);
            value ? untrusted.enable() : untrusted.disable();
        });
    }

    public doSave() {
        const values = this.workspaceFolderSettingForm.getRawValue();
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

        const updated = Object.assign({}, this.workspaceFolderSetting, newData);

        JSON.stringify(this.workspaceFolderSetting) !== JSON.stringify(updated)
            ? this.saveWorkspaceFolderSetting(updated)
            : this.doCancel();
    }

    public doCancel() {
        this.workspaceFolderSettingForm.disable();
        this.cancel.emit(this.workspaceFolderSetting);
    }

    @HostListener("keydown", ["$event"])
    protected handleKeyDownEvent(event: KeyboardEvent) {
        event.stopPropagation();

        if (event.key === "Enter") {
            this.doSave();
        }
    }

    private saveWorkspaceFolderSetting(connection: WorkspaceFolderSetting) {
        this.save.emit({new: connection, old: this.workspaceFolderSetting});
    }
}
