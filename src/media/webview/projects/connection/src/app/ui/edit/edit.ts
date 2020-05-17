import { Component, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, take, switchMap } from "rxjs/operators";
import { VsCodeConnector } from "@vsqlik/core";
import { AuthorizationStrategy, Connection, Action } from "../../data/api";
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

    /**
     * active connection
     */
    public connection: Connection;

    @Output()
    public cancel: EventEmitter<void>;

    private destroy$: Subject<boolean>;

    private beforeSaveHook: BeforeSaveHook;

    constructor(
        private formbuilder: FormBuilder,
        private connectionFormHelper: ConnectionFormHelper,
        private vsCodeConnector: VsCodeConnector
    ) {
        this.destroy$ = new Subject();
        this.cancel = new EventEmitter();

        this.beforeSaveHook = (connection) => this.applyPatch(connection);
    }

    ngOnInit(): void {
        this.connectionFormHelper.connection
            .pipe(takeUntil(this.destroy$))
            .subscribe((connection: Connection) => {
                this.connection = connection;
                this.initConnectionForm();
                this.initAuthorizationStrategyCtrl();
            })

        this.connectionFormHelper.registerBeforeSave(this.beforeSaveHook);
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
            .pipe(
                switchMap((connection) => {
                    return connection.isPhantom
                        ? this.vsCodeConnector.exec({action: Action.Create, data: connection})
                        : this.vsCodeConnector.exec({action: Action.Update, data: connection});
                }),
                take(1)
            )
            .subscribe();
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
            nameCtrl: this.formbuilder.control(this.connection.label),
            hostCtrl: this.formbuilder.control(this.connection.settings.host),
            portCtrl: this.formbuilder.control(this.connection.settings.port),
            secureCtrl: this.formbuilder.control(this.connection.settings.secure),
        });
    }

    /**
     * initialize authorization strategy form
     */
    private initAuthorizationStrategyCtrl() {
        this.authorizationStrategyCtrl = this.formbuilder.control(this.connection.settings.authorization.strategy);
        this.authorizationStrategyCtrl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.connection.settings.authorization.strategy = value;
            });
    }

    /**
     * write data do connection which should be saved
     */
    private applyPatch(connection: Connection): Connection {

        return Object.assign({}, connection, {
            label: this.connectionForm.controls.nameCtrl,
            settings: {
                ...connection.settings,
                ...{
                    host: this.connectionForm.controls.hostCtrl.value,
                    port: this.connectionForm.controls.portCtrl.value,
                    secure: this.connectionForm.controls.secureCtrl.value,
                }
            }
        });
    }
}
