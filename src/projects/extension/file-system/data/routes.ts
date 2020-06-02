import { Route } from "projects/shared/router";
import { QixFsRootDirectory } from "../entry/root.directory";
import { QixFsEntry } from "../entry/entry";

export const Routes: Route<QixFsEntry>[] = [{
    path: "",
    ctrl: QixFsRootDirectory
}];
