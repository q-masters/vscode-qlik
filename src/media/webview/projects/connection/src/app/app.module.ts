import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { VsQlikCoreModule } from "@vsqlik/core";
import { TableRowComponent, TableRowEditComponent, FormStrategyComponent, ConnectionEditComponent } from "./ui";
import { EnumToArrayPipe } from "./ui/utils/enum-to-array";
import { MainComponent } from "./ui/main/main.component";

@NgModule({
    declarations: [
        MainComponent,
        ConnectionEditComponent,
        FormStrategyComponent,
        TableRowComponent,
        TableRowEditComponent,
        EnumToArrayPipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        VsQlikCoreModule,
    ],
    bootstrap: [MainComponent]
})
export class AppModule { }
