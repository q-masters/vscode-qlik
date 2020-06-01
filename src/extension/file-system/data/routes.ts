import { Route } from "@core/router";
import { QixFsRootDirectory } from "../entry/root.directory";
import { QixFsEntry } from "../entry";

export const Routes: Route<QixFsEntry>[] = [{
    path: "",
    ctrl: QixFsRootDirectory
}];
