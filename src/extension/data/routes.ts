import { AppDirectory, ScriptDirectory, ScriptFile, TemporaryFile, VariableDirectory, VariableFile, Route } from "@lib/qixfs";
import { DocumentsDirectory } from "@lib/qixfs";

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
}];
