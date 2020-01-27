import { Route } from "../../utils";
import { DocumentsDirectory } from "./directory/documents";
import { AppDirectory } from "./directory/app";
import { AppScriptDirectory } from "./directory/app-script";
import { QlikScriptFile } from "./file/qlik-script";
import { TemporaryFile } from "./file/temporary";

export const Routes: Route[] = [{
    path: "",
    ctrl: DocumentsDirectory,
}, {
    path: ":app",
    ctrl: AppDirectory,
}, {
    path: ":app/script",
    ctrl: AppScriptDirectory,
}, {
    path: ":app/script/main.qvs",
    ctrl: QlikScriptFile
}, {
    path: ":app/script/:file",
    ctrl: TemporaryFile
}];
