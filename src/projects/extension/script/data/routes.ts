import { Route } from "@core/router";
import { ReadonlyScriptFileCtrl, ScriptDirectoryCtrl, ScriptFileCtrl } from "../files";

export const routes: Route<any>[] = [{
    path: 'remote/:context/:app/script/main.qvs',
    ctrl: ReadonlyScriptFileCtrl
}, {
    path: "streams/:stream/:app/script",
    ctrl: ScriptDirectoryCtrl
}, {
    path: "streams/:stream/:app/script/:file",
    ctrl: ScriptFileCtrl
}, {
    path: "my work/:app/script",
    ctrl: ScriptDirectoryCtrl
}, {
    path: "my work/:app/script/:file",
    ctrl: ScriptFileCtrl
}];
