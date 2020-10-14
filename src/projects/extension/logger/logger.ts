import { singleton } from "tsyringe";
import { getExtensionLogger, IVSCodeExtLogger } from "@vscode-logging/logger";
import * as vscode from "vscode";
import * as winston from "winston";


@singleton()
export class VsQlikLogger {

    private logger: IVSCodeExtLogger;

    public constructor() {

        try {
            this.logger = getExtensionLogger({
                extName: "VsQlik",
                level: "debug",
                logConsole: true,
                logOutputChannel: vscode.window.createOutputChannel("VsQlik Logger"),
                logFormatter: this.formatter
            });
        }  catch (error) {
            debugger;
        }
    }

    public log(data: string): void {
        this.logger.debug(data);
    }

    private get formatter(): any {
        return winston.format((info) => {
            info.message = "FICK DICH";
            return info;
        })();
    }
}
