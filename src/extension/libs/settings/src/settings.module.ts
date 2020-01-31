import {commands} from "vscode";
import { VSQlikConnectionSettingsCommand } from "@data/commands";
import { SettingsWebview } from "./ui";

export class SettingsModule {

    public static bootstrap() {
        commands.registerCommand(VSQlikConnectionSettingsCommand, this.onShowSettingsCommand);
    }

    private static onShowSettingsCommand() {
        const view: SettingsWebview =  new SettingsWebview();
        view.render('VsQlik.Settings', 'VsQlik Settings');
    }
}
