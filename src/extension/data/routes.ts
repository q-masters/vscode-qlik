import { AppDirectory, ScriptDirectory, ScriptFile, TemporaryFile, VariableDirectory, VariableFile, Route } from "@lib/qixfs";
import { DocumentsDirectory } from "@lib/qixfs";
import { SheetDirectory } from "@lib/qixfs/entry/sheet-directory";
import { SheetFile } from "@lib/qixfs/entry/sheet-file";

export const Routes: Route[] = [{
    path: "",
    ctrl: DocumentsDirectory,
}, {
    path: ":app",
    ctrl: AppDirectory,
}, {
    path: ":app/script",
    ctrl: ScriptDirectory,
}, {
    path: ":app/script/main.qvs",
    ctrl: ScriptFile
}, {
    path: ":app/script/:file",
    ctrl: TemporaryFile
}, {
    path: ":app/variables",
    ctrl: VariableDirectory
}, {
    path: ":app/variables/:variable",
    ctrl: VariableFile
}, {
    path: ":app/sheets",
    ctrl: SheetDirectory
}, {
    path: ":app/sheets/:sheet",
    ctrl: SheetFile
}];
