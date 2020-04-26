import * as vscode from "vscode";
import { AuthFormStrategy } from "../../util/src/form.strategy";

/**
 * get login credentials via login window
 */
export async function LoginCommand(uri: string) {

    const username = await vscode.window.showInputBox({
        placeHolder: "Domain\\Username",
        prompt: "Username"
    });

    const password = await vscode.window.showInputBox({
        password: true,
        prompt: "password"
    });

    /**
     * should be passed via event
     */
    const loginStrategy = new AuthFormStrategy(uri);
    if (username && password) {
        loginStrategy.authorize(username, password);
    }
}
