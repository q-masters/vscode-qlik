import { ConnectionSettingsWebview } from "../ui/settings.webview";
import { container } from "tsyringe";
import { SettingsRepository } from "../utils/settings.repository";

export function OpenSettingsCommand() {

    const view = new ConnectionSettingsWebview(
        container.resolve(SettingsRepository)
    );

    view.render('VsQlik.Connection.Settings', 'VsQlik Connection Settings');
}
