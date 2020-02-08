import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ConnectionAppComponent } from "./app.component";
import { VsQlikCoreModule } from "@vsqlik/core";
import { TableComponent, TableRowComponent, TableRowEditComponent } from "./ui";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
      ConnectionAppComponent,
      TableComponent,
      TableRowComponent,
      TableRowEditComponent
  ],
  imports: [
      ReactiveFormsModule,
      BrowserModule,
      VsQlikCoreModule,
  ],
  bootstrap: [ConnectionAppComponent]
})
export class AppModule { }
