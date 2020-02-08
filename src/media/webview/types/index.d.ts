interface VsCodeCommand<T> {
    command: string;
    data?: T;
}

interface Vscode {
    postMessage<T>(command: VsCodeCommand<T>): void;
}

declare function  acquireVsCodeApi(): Vscode;
