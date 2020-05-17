import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ConnectionFormHelper, BeforeSaveHook } from "../../utils/connection-form.helper";
import { Connection, AuthorizationStrategy, ConnectionSettings } from "../../data/api";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface FormStrategyData {
    domain: string;
    username: string | undefined;
    password: string | undefined;
}

@Component({
    selector: "vsqlik-connection--form-strategy ",
    templateUrl: "./form.html",
    styleUrls: ["./form.scss"]
})
export class FormStrategyComponent implements OnInit, OnDestroy {

    public usernameCtrl: FormControl;

    public domainCtrl: FormControl;

    public passwordCtrl: FormControl;

    private strategyData: FormStrategyData

    private destroy$: Subject<boolean>;

    private beforeSaveHook: BeforeSaveHook;

    constructor(
        private formbuilder: FormBuilder,
        private connectionFormHelper: ConnectionFormHelper
    ) {
        this.destroy$ = new Subject();
        this.beforeSaveHook = (connection) => this.applyPatch(connection);
    }

    ngOnInit(): void {
        this.connectionFormHelper.connection
            .pipe(takeUntil(this.destroy$))
            .subscribe((connection: Connection) => {
                this.strategyData = connection.settings.authorization.data as FormStrategyData;
                this.initFormControls();
            });

        this.connectionFormHelper.registerBeforeSave(this.beforeSaveHook);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;

        this.connectionFormHelper.unregisterBeforeSave(this.beforeSaveHook);
        this.beforeSaveHook = null;
    }

    /**
     * apply data to connection data
     */
    private applyPatch(connection: Connection): Connection {
        const settingsPatch = this.createPatch({...connection.settings});
        return Object.assign({}, connection, settingsPatch);
    }

    /**
     * create patch for authorization settings
     */
    private createPatch(settings: ConnectionSettings): ConnectionSettings {
        return Object.assign(settings, {
            authorization: {
                strategy: AuthorizationStrategy.FORM,
                data: {
                    domain: this.domainCtrl.value,
                    username: this.usernameCtrl.value,
                    password: this.passwordCtrl.value,
                }
            }
        });
    }

    /**
     * initialize required form controls
     */
    private initFormControls() {
        this.usernameCtrl = this.formbuilder.control(this.strategyData.username, {updateOn: "blur"});
        this.passwordCtrl = this.formbuilder.control(this.strategyData.password, {updateOn: "blur"});
        this.domainCtrl   = this.formbuilder.control(this.strategyData.domain,   {updateOn: "blur"});
    }
}
