import * as vscode from "vscode";
import { Step } from "./api";

export class InputStep extends Step<string> {

    private disposeables: vscode.Disposable[] = [];

    private field: vscode.InputBox;

    public constructor(
        private placeholder: string,
        private isPassword = false
    ) {
        super();
    }

    /**
     * renders input box to vscode and listen on events
     */
    public execute(): Promise<string> {
        this.field = this.render();

        return new Promise((resolve, reject) => {
            this.disposeables = [
                this.field.onDidAccept(() => resolve(this.field.value)),
                this.field.onDidHide(() => reject())
            ];
        });
    }

    /**
     * destroy vscode input box
     */
    public destroy(): void {
        this.disposeables.forEach((disposeable) => disposeable.dispose());
        this.field.dispose();
    }

    /**
     * construct new input box and renders it to vscode
     */
    private render(): vscode.InputBox {
        const field = vscode.window.createInputBox();
        field.title = this.title;
        field.password = this.isPassword;
        field.placeholder = this.placeholder;
        field.ignoreFocusOut = true;
        field.show();

        return field;
    }
}
