import { Route } from "projects/shared/router";
import { QixFsEntry } from "../entry/qixfs-entry";
import { QixFsRootDirectory } from "../entry/root.directory";
import { ApplicationDirectory } from "../entry/app.directory";
import { ScriptDirectory } from "../entry/script.directory";
import { ScriptFile } from "../entry/script.file";
import { VariableDirectory } from "../entry/variable.directory";
import { VariableFile } from "../entry/variable.file";
import { SheetDirectory } from "../entry/sheet-directory";
import { SheetFile } from "../entry/sheet-file";
import { QixFsStreamRootDirectory } from "../entry/streams.directory";
import { QixFsAppListMyWorkDirectory } from "../entry/app-list.my-work.directory";
import { QixFsAppListStreamDirectory } from "../entry/app-list.stream.directory";

export const Routes: Route<QixFsEntry>[] = [
    /** Workspace Folder Root Directory */
    {
        path: "",
        ctrl: QixFsRootDirectory
    },
    /** MyWork */
    {
        path: "my work",
        ctrl: QixFsAppListMyWorkDirectory,
    }, {
        path: "my work/:app",
        ctrl: ApplicationDirectory
    }, {
        path: "my work/:app/script",
        ctrl: ScriptDirectory
    }, {
        path: "my work/:app/script/:file",
        ctrl: ScriptFile
    }, {
        path: "my work/:app/variables",
        ctrl: VariableDirectory
    }, {
        path: "my work/:app/variables/:name",
        ctrl: VariableFile
    }, {
        path: "my work/:app/sheets",
        ctrl: SheetDirectory
    }, {
        path: "my work/:app/sheets/:sheet",
        ctrl: SheetFile
    },
    /** streams */
    {
        path: "streams",
        ctrl: QixFsStreamRootDirectory
    }, {
        path: "streams/:stream",
        ctrl: QixFsAppListStreamDirectory
    }, {
        path: "streams/:stream/:app",
        ctrl: ApplicationDirectory
    }, {
        path: "streams/:stream/:app/script",
        ctrl: ScriptDirectory
    }, {
        path: "streams/:stream/:app/script/:file",
        ctrl: ScriptFile
    }, {
        path: "streams/:stream/:app/variables",
        ctrl: VariableDirectory
    }, {
        path: "streams/:stream/:app/variables/:name",
        ctrl: VariableFile
    }, {
        path: "streams/:stream/:app/sheets",
        ctrl: SheetDirectory
    }, {
        path: "streams/:stream/:app/sheets/:sheet",
        ctrl: SheetFile
    }
];
