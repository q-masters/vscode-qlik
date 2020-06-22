import { ConnectionSettingsWebview } from "./settings.webview";
import { container } from "tsyringe";
import { SettingsRepository } from "./settings.repository";
import { ExtensionContext } from "projects/extension/data/tokens";

export function OpenSettingsCommand() {

    const view = new ConnectionSettingsWebview(
        container.resolve(SettingsRepository),
        container.resolve(ExtensionContext)
    );

    view.render('VsQlik.Connection.Settings', 'VsQlik Connection Settings');
}
