import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PortalModule } from "@angular/cdk/portal";
import { TabComponent } from "./ui/tab";

@NgModule({
    declarations: [
        TabComponent
    ],
    imports: [
        CommonModule,
        PortalModule
    ],
    exports: [
        TabComponent
    ],
    providers: [],
})
export class TabsModule {
}
