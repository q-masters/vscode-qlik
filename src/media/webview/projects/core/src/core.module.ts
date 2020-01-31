import { NgModule, APP_INITIALIZER } from "@angular/core";
import { VsCodeConnector } from "./utils";

@NgModule({
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
