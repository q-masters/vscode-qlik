import { Route } from "projects/shared/router";
import { QixFsEntry } from "./entry";
import { QixFsRootDirectory } from "../entry/root.directory";
import { ApplicationDirectory } from "../entry/application.directory";
import { ScriptDirectory } from "../entry/script.directory";
import { ScriptFile } from "../entry/script.file";

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
    path: ":app/script/main.qvs",
    ctrl: ScriptFile
}];
