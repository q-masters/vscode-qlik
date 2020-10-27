import { Observable, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export class Application {

    private close$: Subject<void> = new Subject();

    /**
     * broadcast all app changes
     */
    private appChange$: Subject<any> = new Subject();

    /**
     * current count of registered observers
     */
    private observerCount = 0;

    private doc: Promise<EngineAPI.IApp>;

    /** */
    private script: string | null = null;

    public constructor(
        private globalContext: EngineAPI.IGlobal,
        private name: string,
        private server: string
    ) {}

    /**
     * return global context for app
     */
    public get global(): EngineAPI.IGlobal {
        return this.globalContext;
    }

    /**
     * returns the active doc, cache the promise since this one
     * has exactly one of those states fulfilled, rejected which never
     * changes
     */
    public get document(): Promise<EngineAPI.IApp> {
        if (!this.doc) {
            this.doc = this.global.openDoc(this.name);
        }
        return this.doc;
    }

    /**
     * return script for currrent application
     * load only once since we need to persist it.
     *
     * if we save the script on server side (browser) we will simply override
     * everything what exists since we are not aware of any changes
     */
    public async getScript(force = false): Promise<string> {
        if (!this.script || force) {
            const doc    = await this.document;
            const script = await doc.getScript();

            if (!force) {
                console.log(script);
                this.script = script;
            }
            return script;
        }
        return this.script;
    }

    /**
     * set script to null so next time we fetch the script we got it from server
     */
    public releaseScript(): void {
        this.script = null;
    }

    /** update a script */
    public async updateScript(content: string): Promise<void> {
        this.script = content;

        const doc = await this.doc;
        await doc.setScript(content);
        await doc.doSave();
    }

    public get appName(): string {
        return this.name;
    }

    public get serverName(): string {
        return this.server;
    }

    /**
     * close current app
     */
    public async close(): Promise<void> {
        this.close$.next();

        (await this.document as any).removeListener('changed', this.onDocumentChange.bind(this));
        await this.global.session.close();

        this.appChange$.complete();
        this.close$.complete();
    }

    public onClose(): Observable<void> {
        return this.close$.asObservable();
    }

    /**
     * create a warm observeable which registerns once on app changed event
     * if the the first one subscribe, for unsusubscript if no listeners left
     * unregister again from app changed event
     */
    public onChanged(): Observable<any> {
        /** subscribe */
        return new Observable((observer) => {

            if (this.observerCount === 0) {
                this.observerCount += 1;
                this.registerOnDocumentChange();
            }

            /** subscribe to app changes stream */
            const change$ = this.appChange$
                .pipe(debounceTime(500))
                .subscribe(observer);

            /** unsubscribe */
            return () => {
                change$.unsubscribe();
                this.observerCount -= 1;

                console.log("unsubscribe");

                if (this.observerCount === 0) {
                    this.unregisterOnDocumentChange();
                }
            };
        });
    }

    private onDocumentChange() {
        this.appChange$.next();
    }

    private async registerOnDocumentChange() {
        const doc = await this.document;
        doc.on("changed", this.onDocumentChange.bind(this));
    }

    private async unregisterOnDocumentChange() {
        const doc = await this.document;
        (doc as any).removeListener("changed", this.onDocumentChange.bind(this));
    }
}
