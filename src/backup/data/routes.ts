import { AppDirectory, ScriptDirectory, ScriptFile, TemporaryFile, VariableDirectory, VariableFile } from "backup/libs/qixfs";
import { SheetDirectory } from "backup/libs/qixfs/entry/sheet-directory";
import { SheetFile } from "backup/libs/qixfs/entry/sheet-file";
import { DocumentsDirectory } from "backup/libs/qixfs";
import { Route } from "backup/core/router/router";
import { AuthGuard } from "backup/core/authorization/utils/auth-guard";

export const Routes: Route[] = [{
    path: "",
    ctrl: DocumentsDirectory,
    canActivate: [AuthGuard],
    children: [
        {
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
        }
    ]
}];
