import { ConnectionSetting } from "@core/connection";
import { Setting } from "../utils/settings.repository";

export enum FileRenderer {
    JSON,
    YAML
}

export interface WorkspaceSetting extends Setting {

    name: string;

    connection: ConnectionSetting;

    fileRenderer: FileRenderer;
}
