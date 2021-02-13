import { AuthorizationResult, AuthorizationStrategy } from "./authorization.strategy";
import * as vscode from "vscode";
import { ChildProcess } from "child_process";
import * as path from "path";

/**
 * login to qlik with form strategy
 */
export class ExternalAuthorizationStrategy extends AuthorizationStrategy {

    /**
     * start authorization process
     *
     */
    public async run(): Promise<AuthorizationResult> {
        const electron_app = path.resolve(__dirname, `electron-main.js`);

        return new Promise((resolve) => {
            const process = vscode.commands.executeCommand<ChildProcess>('qmasters:electron.run', electron_app, 'http://windows-10-privat.shared');
            this.onConnected(process, resolve);
        });
    }

    /**
     * listen to messages from electron app
     *
     */
    private async onConnected(process: Thenable<ChildProcess | undefined>, next: (value: AuthorizationResult) => void) {

        const appProcess = await process;

        if (!appProcess) {
            next({success: false, cookies: []});
        } else {
            appProcess.on('message', (message: any) => {
                if (message.method === "authorized") {
                    next({
                        success: true,
                        cookies: message.cookies
                    });

                    appProcess.disconnect();
                    appProcess.kill("SIGINT");
                }
            });
        }
    }
}

export default ExternalAuthorizationStrategy;
