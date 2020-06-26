import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { ConnectionFormHelper, BeforeSaveHook } from "../../utils/connection-form.helper";
import { WorkspaceFolderSetting } from "../../data/api";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface FormStrategyData {
    domain: string;
    password: string | undefined;
}

@Component({
    selector: "vsqlik-settings--form-strategy ",
    templateUrl: "./form.html",
    styleUrls: ["./form.scss"]
})
export class FormStrategyComponent implements OnInit, OnDestroy {

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
        this.initFormControls();

        this.connectionFormHelper.connection
            .pipe(takeUntil(this.destroy$))
            .subscribe((setting: WorkspaceFolderSetting) => {
                this.strategyData = setting.connection.authorization.data as FormStrategyData;
                this.reloadData();
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
    private applyPatch(connection: WorkspaceFolderSetting): WorkspaceFolderSetting {
        const settingsPatch = this.createPatch({...connection});
        return Object.assign({}, connection, settingsPatch);
    }

    /**
     * create patch for authorization settings
     */
    private createPatch(settings: WorkspaceFolderSetting): WorkspaceFolderSetting {
        settings.connection.authorization = Object.assign({},
            settings.connection.authorization,
            {
                data: {
                    domain: this.domainCtrl.value,
                    password: this.passwordCtrl.value,
                }
            }
        );
        return settings;
    }

    /**
     * initialize required form controls
     */
    private initFormControls() {
        this.domainCtrl   = this.formbuilder.control("",   {updateOn: "blur"});
        this.passwordCtrl = this.formbuilder.control("", {updateOn: "blur"});
    }

    /**
     * update form controls
     */
    private reloadData() {
        this.domainCtrl.setValue(this.strategyData.domain, {emitEvent: false});
        this.passwordCtrl.setValue(this.strategyData.password, {emitEvent: false});
    }
}
