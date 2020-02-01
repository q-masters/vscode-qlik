import { NgModule, APP_INITIALIZER } from "@angular/core";
import { VsCodeConnector } from "./utils";
import { MouseDblClickDirective } from "./ui";

@NgModule({
    declarations: [
        MouseDblClickDirective
    ],
    exports: [
        MouseDblClickDirective
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: (connector: VsCodeConnector) => () => connector.initialize(),
            deps: [VsCodeConnector]
        }
    ]
})
export class VsQlikCoreModule { }
