import { Component, OnInit } from "@angular/core";
import { VsCodeConnector } from "@vsqlik/core/utils";

@Component({
    selector: "vsqlik-settings--root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class SettingsAppComponent implements OnInit {

    title = "settings";

    public constructor(
        private connector: VsCodeConnector
    ) {}

    public ngOnInit() {
        /**
         * connections kann man lesen
         * löschen
         * updaten
         * hinzufügen
         */
        this.connector.onReciveMessage().subscribe((message) => {
            console.log(message);
        });
    }
}
