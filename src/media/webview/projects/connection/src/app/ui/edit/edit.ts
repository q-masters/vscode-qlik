import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { AuthorizationStrategy, Connection } from "../../data";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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

    @Input()
    public connection: Connection;

    @Output()
    public cancel: EventEmitter<void>;

    @Output()
    public save: EventEmitter<Connection>;

    private destroy$: Subject<boolean>;

    constructor(
        private formbuilder: FormBuilder
    ) {
        this.destroy$ = new Subject();
        this.save   = new EventEmitter();
        this.cancel = new EventEmitter();
    }

    ngOnInit(): void {

        this.connectionForm = this.formbuilder.group({
            nameCtrl: this.formbuilder.control(this.connection.label),
            hostCtrl: this.formbuilder.control(this.connection.settings.host),
            portCtrl: this.formbuilder.control(this.connection.settings.port),
            saveCtrl: this.formbuilder.control(true),
        });

        this.initAuthorizationStrategyCtrl();
    }

    /**
     *
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }

    /**
     * save all changes
     */
    public doSave() {
        this.save.emit(this.connection);
    }

    /**
     * cancel
     */
    public doCancel() {
        this.cancel.emit();
    }

    /**
     *
     */
    private initAuthorizationStrategyCtrl() {

        /** authorization form control */
        this.authorizationStrategyCtrl = this.formbuilder.control(this.connection.settings.authorization.strategy);
        this.authorizationStrategyCtrl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.connection.settings.authorization.strategy = value;
            });
    }
}
