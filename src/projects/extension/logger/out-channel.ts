import * as vscode from "vscode";
import { MESSAGE } from "triple-beam";
import TransportStream from "winston-transport";

export class VsQlikOutputChannelTransport extends TransportStream {

    private outChannel: vscode.OutputChannel;

    public constructor(options?: TransportStream.TransportStreamOptions) {
        super(options);
        this.outChannel = vscode.window.createOutputChannel(`VsQlik_Log`);
        this.outChannel.show();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public log(data: any, callback): void {
        setImmediate(() => this.emit('logged', data));
        this.outChannel.appendLine(data[MESSAGE]);
        callback();
    }

    public close(): void {
        this.outChannel.dispose();
    }
}
