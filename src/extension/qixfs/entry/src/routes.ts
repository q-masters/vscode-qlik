import { Route } from "../../utils";
import { DocumentsDirectory } from "./directory/documents";
import { AppDirectory } from "./directory/app";
import { ScriptDirectory } from "./script/directory";
import { ScriptFile } from "./script/file";
import { TemporaryFile } from "./file/temporary";
import { VariableDirectory } from "./variable/directory";
import { VariableFile } from "./variable/file";

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
