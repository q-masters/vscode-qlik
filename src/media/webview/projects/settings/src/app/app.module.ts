import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { SettingsAppComponent } from "./app.component";
import { VsQlikCoreModule } from "@vsqlik/core";

@NgModule({
  declarations: [
      SettingsAppComponent
  ],
  imports: [
      BrowserModule,
      VsQlikCoreModule,
  ],
  bootstrap: [SettingsAppComponent]
})
export class AppModule { }
