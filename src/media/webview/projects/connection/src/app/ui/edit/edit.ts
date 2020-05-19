import { Component, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthorizationStrategy, Connection } from "../../data/api";
import { ConnectionFormHelper, BeforeSaveHook } from "../../utils";

@Component({
    selector: "vsqlik-connection--edit",
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

    @Output()
    public cancel: EventEmitter<void>;

    @Output()
    public save: EventEmitter<Connection>;

    /**
     * active connection
     */
    private connection: Connection;

    /**
     * emits true if component gets destroyed
     */
    private destroy$: Subject<boolean>;

    /**
     * hook before data will be saved
     */
    private beforeSaveHook: BeforeSaveHook;

    constructor(
        private formbuilder: FormBuilder,
        private connectionFormHelper: ConnectionFormHelper,
    ) {
        this.destroy$ = new Subject();
        this.cancel   = new EventEmitter();
        this.save     = new EventEmitter();

        this.beforeSaveHook = (connection) => this.applyPatch(connection);
    }

    ngOnInit(): void {

        this.initConnectionForm();
        this.initAuthorizationStrategyCtrl();

        this.connectionFormHelper.registerBeforeSave(this.beforeSaveHook);

        this.connectionFormHelper.connection
            .pipe(takeUntil(this.destroy$))
            .subscribe((connection: Connection) => {
                this.connection = connection;
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

        this.connectionFormHelper.unregisterBeforeSave(this.beforeSaveHook);
        this.beforeSaveHook = null;
    }

    /**
     * save all changes
     */
    public doSave() {
        this.connectionFormHelper.save()
            .pipe(takeUntil(this.destroy$))
            .subscribe((connection) => this.save.emit(connection));
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
            nameCtrl: this.formbuilder.control(""),
            hostCtrl: this.formbuilder.control(""),
            portCtrl: this.formbuilder.control(null),
            secureCtrl: this.formbuilder.control(true),
            untrustedCertCtrl: this.formbuilder.control(false)
        });
    }

    /**
     * update form controls if a new connection model has been loaded
     */
    private reloadFormData() {
        /** update base connection */
        this.connectionForm.patchValue({
            nameCtrl: this.connection.label,
            hostCtrl: this.connection.host,
            portCtrl: this.connection.port,
            secureCtrl: this.connection.secure,
            untrustedCertCtrl: this.connection.allowUntrusted
        }, {onlySelf: true, emitEvent: false});

        /** update strategy */
        this.authorizationStrategyCtrl.setValue(
            this.connection.authorization.strategy,
            {emitEvent: false}
        );
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
                this.connection.authorization.strategy = value;
            });
    }

    /**
     * write data do connection which should be saved
     */
    private applyPatch(connection: Connection): Connection {

        return Object.assign({}, connection, {
            label: this.connectionForm.controls.nameCtrl.value,
            ...{
                host: this.connectionForm.controls.hostCtrl.value,
                port: this.connectionForm.controls.portCtrl.value,
                secure: this.connectionForm.controls.secureCtrl.value,
            }
        });
    }
}
