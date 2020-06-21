interface VsCodeRequest<T> {
    action: string;
    data?: T;
}

interface Vscode {
    postMessage<T>(VsCodeRequest): void;
}

declare function  acquireVsCodeApi(): Vscode;
