import { Injectable, NgZone } from "@angular/core";
import { Observable, fromEvent, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({providedIn: "root"})
export class VsCodeConnector {

    private isInitialized = false;

    private vscode: Vscode;

    /**
     * message we recive from vscode in JSON format
     */
    private message$: Subject<any> = new Subject();

    public constructor(
        private zone: NgZone
    ) {}

    public initialize() {
        if (!this.isInitialized) {
            this.vscode = acquireVsCodeApi();
            this.isInitialized = true;
            this.registerWindowMessageEvent();
        }
    }

    /** post message command to vscode */
    public exec<T>(command: VsCodeCommand<T>) {
        this.vscode.postMessage(command);
    }

    /**
     * register to get message
     */
    public onReciveMessage<T>(): Observable<T> {
        return this.message$.asObservable();
    }

    /**
     * receive message from vscode and delegate to message stream
     */
    private registerWindowMessageEvent() {
        this.zone.runOutsideAngular(() => fromEvent(window, "message")
            .pipe(map((event: MessageEvent) => event.data))
            .subscribe((message) => {
                /** run again into zone ... wow */
                this.zone.run(() => this.message$.next(message));
            })
        );
    }
}
