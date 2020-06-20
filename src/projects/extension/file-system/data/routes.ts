import { Route } from "projects/shared/router";
import { QixFsEntry } from "./entry";
import { QixFsRootDirectory } from "../entry/root.directory";
import { ApplicationDirectory } from "../entry/application.directory";
import { ScriptDirectory } from "../entry/script.directory";
import { ScriptFile } from "../entry/script.file";
import { VariableDirectory } from "../entry/variable.directory";
import { VariableFile } from "../entry/variable.file";
import { SheetDirectory } from "../entry/sheet-directory";
import { SheetFile } from "../entry/sheet-file";

export const Routes: Route<QixFsEntry>[] = [{
    path: "",
    ctrl: QixFsRootDirectory
}, {
    path: ":app",
    ctrl: ApplicationDirectory
}, {
    path: ":app/script",
    ctrl: ScriptDirectory
}, {
    path: ":app/script/:file",
    ctrl: ScriptFile
}, {
    path: ":app/variables",
    ctrl: VariableDirectory
}, {
    path: ":app/variables/:name",
    ctrl: VariableFile
}, {
    path: ":app/sheets",
    ctrl: SheetDirectory
}, {
    path: ":app/sheets/:sheet",
    ctrl: SheetFile
}];
