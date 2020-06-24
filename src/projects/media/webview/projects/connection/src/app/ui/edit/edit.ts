import { Component, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthorizationStrategy, WorkspaceFolderSetting, FileRenderer } from "../../data/api";
import { ConnectionFormHelper } from "../../utils";

@Component({
    selector: "vsqlik-settings--edit",
    templateUrl: "./edit.html",
    styleUrls: ["./edit.scss"]
})
export class ConnectionEditComponent implements OnInit, OnDestroy {

    /**
     * formGroup ConnectionForm
     */
    public connectionForm: FormGroup;

    /**
     * enum authorization strategies so we can use them in template again
     */
    public authorizationStrategy = AuthorizationStrategy;

    /**
     * form control for authorization strategy
     */
    public authorizationStrategyCtrl: FormControl;

    /**
     * enum data objects (like variables) should rendererd in this format
     * (yaml, json, ...)
     */
    public objectRenderStrategy = FileRenderer;

    /**
     * form control for render strategy
     */
    public objectRenderStrategyCtrl: FormControl;

    @Output()
    public cancel: EventEmitter<void>;

    @Output()
    public save: EventEmitter<WorkspaceFolderSetting>;

    /**
     * active connection
     */
    private workspaceFolderSetting: WorkspaceFolderSetting;

    /**
     * emits true if component gets destroyed
     */
    private destroy$: Subject<boolean>;

    constructor(
        private formbuilder: FormBuilder,
        private connectionFormHelper: ConnectionFormHelper,
    ) {
        this.destroy$ = new Subject();
        this.cancel   = new EventEmitter();
        this.save     = new EventEmitter();
    }

    ngOnInit(): void {

        this.initConnectionForm();
        this.initAuthorizationStrategyCtrl();
        this.initObjectRenderStrategyCtrl();

        this.connectionFormHelper.registerBeforeSave(this.beforeSaveHook.bind(this));

        this.connectionFormHelper.connection
            .pipe(takeUntil(this.destroy$))
            .subscribe((setting: WorkspaceFolderSetting) => {
                this.workspaceFolderSetting = setting;
                this.reloadFormData();
            });
    }

    /**
     *
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;

        this.connectionFormHelper.unregisterBeforeSave(this.beforeSaveHook.bind(this));
    }

    /**
     * save all changes
     */
    public doSave() {
        this.connectionFormHelper.save()
            .pipe(takeUntil(this.destroy$))
            .subscribe((connection) => {
                this.save.emit(connection)
            });
    }

    /**
     * cancel
     */
    public doCancel() {
        this.cancel.emit();
    }

    /**
     * initialize base form for connection
     */
    private initConnectionForm() {
        this.connectionForm = this.formbuilder.group({
            fileRendererCtrl: this.formbuilder.control(this.objectRenderStrategy.YAML),
            nameCtrl: this.formbuilder.control(""),
            hostCtrl: this.formbuilder.control(""),
            portCtrl: this.formbuilder.control(null),
            pathCtrl: this.formbuilder.control(null),
            secureCtrl: this.formbuilder.control(true),
            untrustedCertCtrl: this.formbuilder.control(false)
        });
    }

    /**
     * initialize authorization strategy form
     */
    private initAuthorizationStrategyCtrl() {
        this.authorizationStrategyCtrl = this.formbuilder.control(AuthorizationStrategy.FORM);

        /** register on value changes to update strategy */
        this.authorizationStrategyCtrl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.workspaceFolderSetting.connection.authorization.strategy = value;
            });
    }

    /**
     * initialize object render strategy control
     */
    private initObjectRenderStrategyCtrl() {
        this.objectRenderStrategyCtrl = this.formbuilder.control(FileRenderer.YAML);

        /** register on value changes to update strategy */
        this.objectRenderStrategyCtrl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => this.workspaceFolderSetting.fileRenderer = value);
    }

    /**
     * update form controls if a new connection model has been loaded
     */
    private reloadFormData() {
        /** update base connection */
        this.connectionForm.patchValue({
            fileRendererCtrl: this.workspaceFolderSetting.fileRenderer,
            nameCtrl: this.workspaceFolderSetting.label,
            hostCtrl: this.workspaceFolderSetting.connection.host,
            portCtrl: this.workspaceFolderSetting.connection.port,
            pathCtrl: this.workspaceFolderSetting.connection.path,
            secureCtrl: this.workspaceFolderSetting.connection.secure,
            untrustedCertCtrl: this.workspaceFolderSetting.connection.allowUntrusted
        }, {onlySelf: true, emitEvent: false});

        /** update authorization strategy */
        this.authorizationStrategyCtrl.setValue(this.workspaceFolderSetting.connection.authorization.strategy, {emitEvent: false});

        /** update object renderer strategy */
        this.objectRenderStrategyCtrl.setValue(this.workspaceFolderSetting.fileRenderer, {emitEvent: false});
    }

    /**
     * form helper want to save the data so we can write them
     */
    private beforeSaveHook(connection: WorkspaceFolderSetting): WorkspaceFolderSetting {
        return Object.assign({}, connection, {
            label: this.connectionForm.controls.nameCtrl.value,
            connection: {
                host: this.connectionForm.controls.hostCtrl.value,
                port: this.connectionForm.controls.portCtrl.value,
                path: this.connectionForm.controls.pathCtrl.value,
                secure: this.connectionForm.controls.secureCtrl.value,
                allowUntrusted: this.connectionForm.controls.untrustedCertCtrl.value
            },
            fileRenderer: this.connectionForm.controls.fileRendererCtrl.value
        });
    }
}
