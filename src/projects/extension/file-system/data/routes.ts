import { Route } from "projects/shared/router";
import { QixFsEntry } from "../entry/qix/qixfs-entry";
import { QixFsRootDirectory } from "../entry/root.directory";
import { ApplicationDirectory } from "../entry/application/app.directory";
import { VariableDirectory } from "../entry/variable/variable.directory";
import { VariableFile } from "../entry/variable/variable.file";
import { SheetDirectory } from "../entry/sheet/sheet-directory";
import { SheetFile } from "../entry/sheet/sheet-file";
import { QixFsStreamRootDirectory } from "../entry/streams.directory";
import { AppListMyWorkDirectory } from "../entry/application/app-list.my-work.directory";
import { AppListStreamDirectory } from "../entry/application/app-list.stream.directory";
import { MeasureDirectory } from "../entry/master-items/measure.directory";
import { MeasureFile } from "../entry/master-items/measure.file";
import { DimensionDirectory } from "../entry/master-items/dimensions.directory";
import { DimensionFile } from "../entry/master-items/dimension.file";
import { VisualizationDirectory } from "../entry/master-items/visualization.directory";
import { VisualizationFile } from "../entry/master-items/visualization.file";

export const Routes: Route<QixFsEntry>[] = [
    /** Workspace Folder Root Directory */
    {
        path: "",
        ctrl: QixFsRootDirectory
    },

    /** MyWork */
    {
        path: "my work",
        ctrl: AppListMyWorkDirectory,
    }, {
        path: "my work/:app",
        ctrl: ApplicationDirectory
    }, {
        path: "my work/:app/measures",
        ctrl: MeasureDirectory
    }, {
        path: "my work/:app/measures/:measure",
        ctrl: MeasureFile
    }, {
        path: "my work/:app/dimensions",
        ctrl: DimensionDirectory
    }, {
        path: "my work/:app/dimensions/:dimension",
        ctrl: DimensionFile
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
    {
        path: "my work/:app/visualization",
        ctrl: VisualizationDirectory
    },
    {
        path: "my work/:app/visualization/:id",
        ctrl: VisualizationFile
    },
    /** streams */
    {
        path: "streams",
        ctrl: QixFsStreamRootDirectory
    }, {
        path: "streams/:stream",
        ctrl: AppListStreamDirectory
    }, {
        path: "streams/:stream/:app",
        ctrl: ApplicationDirectory
    }, {
        path: "streams/:stream/:app/dimensions",
        ctrl: DimensionDirectory
    }, {
        path: "streams/:stream/:app/dimensions/:dimension",
        ctrl: DimensionFile
    }, {
        path: "streams/:stream/:app/measures",
        ctrl: MeasureDirectory
    }, {
        path: "streams/:stream/:app/measures/:measure",
        ctrl: MeasureFile
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
    },
    {
        path: "streams/:stream/:app/visualization",
        ctrl: VisualizationDirectory
    },
    {
        path: "streams/:stream/:app/visualization/:id",
        ctrl: VisualizationFile
    }
];
