import { Injectable, NgZone } from "@angular/core";
import { Observable, fromEvent, Subject } from "rxjs";
import { map, filter, take } from "rxjs/operators";

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
    public exec<T>(action: VsCodeRequest<T>): Observable<T> {
        /**
         * create request container, this is lazy and will only sends
         * if subscribed to it
         */
        return new Observable<T>((subscriber) => {
            const header = {id: Math.random().toString(32).substr(2)};
            const request = {header, body: action};

            this.message$.pipe(
                filter((response) => response.request?.header.id === request.header.id),
                take(1)
            )
            .subscribe({
                next:  (response) => subscriber.next(response.body),
                error: (msg)      => subscriber.error(msg)
            });

            this.vscode.postMessage(request);
        });
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
            .subscribe((response) => {
                this.zone.run(() => this.message$.next(response));
            })
        );
    }
}
