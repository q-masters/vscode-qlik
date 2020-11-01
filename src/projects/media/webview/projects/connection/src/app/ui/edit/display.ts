import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
import { WorkspaceFolderSetting, DisplaySettings } from "../../data/api";
import { ConnectionFormHelper } from "../../utils";

@Component({
    selector: "vsqlik-settings--display",
    templateUrl: "./display.html",
    styleUrls: ["./display.scss"]
})
export class DisplaySettingsComponent implements OnInit, OnDestroy {

    @Input()
    public displaySetting: DisplaySettings;

    public displayFormGroup: FormGroup;

    public displayFields = [
      "dimensions",
      "measures",
      "script",
      "sheets",
      "variables",
      "visualization"
    ];

    /**
     * emits true if component gets destroyed
     */
    private destroy$: Subject<boolean>;

    constructor(
        private formbuilder: FormBuilder,
        private connectionFormHelper: ConnectionFormHelper,
    ) {
        this.destroy$ = new Subject();
    }

    ngOnInit(): void {
      this.connectionFormHelper.onLoad
        .pipe(
          takeUntil(this.destroy$),
          map((setting: WorkspaceFolderSetting) => setting.display)
        )
        .subscribe((setting) => this.settingsLoaded(setting));

      this.connectionFormHelper.registerBeforeSave(this.beforeSaveHook.bind(this));
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
     * settings has been loaded
     */
    public settingsLoaded(setting: DisplaySettings) {
        this.displayFormGroup = this.createForm(setting);
    }

    /**
     *
     */
    private createForm(setting: DisplaySettings): FormGroup {
        return this.formbuilder.group({
            dimensions: this.formbuilder.control(setting?.dimensions ?? true),
            measures: this.formbuilder.control(setting?.measures ?? true),
            script: this.formbuilder.control(setting?.script ?? true),
            sheets: this.formbuilder.control(setting?.sheets ?? true),
            variables: this.formbuilder.control(setting?.variables ?? true),
            visualization: this.formbuilder.control(setting?.visualization ?? true),
        });
    }

    /**
     * form should be written
     */
    private beforeSaveHook(setting: WorkspaceFolderSetting): WorkspaceFolderSetting {
      return {
        ...setting,
        display: this.displayFormGroup.getRawValue()
      };
    }
}

