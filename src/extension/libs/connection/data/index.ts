import { SettingsRepository } from "@utils";
import { SessionToken } from "@data/tokens";
import { Connection } from "../api";

/** connection settings */
export const CONNECTION_REPOSITORY = new SessionToken<SettingsRepository<Connection>>("VSCode Connection Settings");
