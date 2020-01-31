interface VsCodeCommand<T> {
    command: string;
    data?: T;
}

interface Vscode {
    postmessage<T>(command: VsCodeCommand<T>): void;
}

declare function  acquireVsCodeApi(): Vscode;
