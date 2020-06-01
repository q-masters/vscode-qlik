import { ConnectionSetting } from "@core/connection";
import { Setting } from "./settings.repository";
import { AuthorizationSetting } from "@core/authorization/api";

export enum FileRenderer {
    JSON,
    YAML
}

export interface WorkspaceSetting extends Setting {

    label: string;

    connection: ConnectionSetting;

    fileRenderer: FileRenderer;

    authorization: AuthorizationSetting
}
