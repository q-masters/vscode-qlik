import { Route } from "@core/router";
import { DocumentsDirectory, AppDirectory, ScriptDirectory, ScriptFile, TemporaryFile, VariableDirectory, VariableFile } from "@core/qixfs";
import { SheetDirectory } from "@core/qixfs/entry/sheet-directory";
import { SheetFile } from "@core/qixfs/entry/sheet-file";
import { AuthGuard } from "@core/authorization/utils/auth-guard";

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
