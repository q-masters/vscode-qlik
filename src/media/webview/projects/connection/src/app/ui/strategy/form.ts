import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";

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
export class FormStrategyComponent implements OnInit {

    public usernameCtrl: FormControl;

    public domainCtrl: FormControl;

    public passwordCtrl: FormControl;

    private strategyData: FormStrategyData

    @Input()
    public set data(data: FormStrategyData) {
        this.strategyData = {...data};
    }

    constructor(
        private formbuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.usernameCtrl = this.formbuilder.control(this.strategyData.username, {updateOn: "blur"});
        this.passwordCtrl = this.formbuilder.control(this.strategyData.password, {updateOn: "blur"});
        this.domainCtrl   = this.formbuilder.control(this.strategyData.domain,   {updateOn: "blur"});
    }
}
