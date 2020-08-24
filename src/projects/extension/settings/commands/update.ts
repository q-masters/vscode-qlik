import { WorkspaceSetting } from "../api";
import { SettingsRepository } from "../settings.repository";
import { container } from "tsyringe";

export function SettingsUpdateCommand(setting: WorkspaceSetting, patch: any) {
    const settingsProvider = container.resolve(SettingsRepository);
    settingsProvider.patchSetting(setting, patch);
}
