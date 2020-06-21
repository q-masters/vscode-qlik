import { OnInit, OnDestroy, Component, ElementRef, ComponentFactoryResolver, Injector, ApplicationRef, Input } from "@angular/core";
import { TabPortalOutlet } from "./tab-portal.outlet";
import { TabConfig } from "../api/tabs";

@Component({
  selector: "vsqlik-tabs",
  templateUrl: "./tab.html",
  styleUrls: [ "./tab.scss" ]
})
export class TabComponent implements OnInit, OnDestroy {

    // The tab portal host we're binding to a ViewChild
    // in this component
    private tabPortalHost: TabPortalOutlet;

    public isCustomTabOutlet = true;

    private outlet: ElementRef;

    @Input()
    public set tabContentOutlet(outlet: ElementRef) {
        if (outlet) {
            this.outlet = outlet;
        }
    }

    public get tabContentOutlet(): ElementRef {
        return this.outlet;
    }

    @Input()
    public tabs: TabConfig[];

    constructor(
        readonly injector: Injector,
        readonly appRef: ApplicationRef,
        readonly componentFactoryResolver: ComponentFactoryResolver
    ) { }

    ngOnInit() {
        this.tabPortalHost = new TabPortalOutlet(
            this.tabs,
            this.tabContentOutlet.nativeElement,
            this.componentFactoryResolver,
            this.appRef,
            this.injector
        );

        if (this.tabs.length) {
            this.tabPortalHost.switchTo(this.tabs[0].name);
        }
    }

    ngOnDestroy() {
        this.tabPortalHost.dispose();
    }

    public isCurrent(name: string) {
        const current = this.tabPortalHost.currentTab;
        return current && current.name === name;
    }

    public switchTo(name: string) {
        this.tabPortalHost.switchTo(name);
        return false;
    }
}
