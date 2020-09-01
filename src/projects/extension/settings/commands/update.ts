import { WorkspaceSetting } from "../api";
import { SettingsRepository } from "../settings.repository";
import { container } from "tsyringe";
import { DataNode } from "@core/qix/utils/qix-list.provider";

export function SettingsUpdateCommand(setting: WorkspaceSetting, patch: DataNode): void {
    const settingsProvider = container.resolve(SettingsRepository);
    settingsProvider.patchSetting(setting, patch);
}
