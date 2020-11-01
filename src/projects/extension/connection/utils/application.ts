import { from, Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";

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

    private appPropertiesSessionObject: Promise<any>;

    /** */
    private script: string | null = null;


    public get appName(): string {
        return this.name;
    }

    public get serverName(): string {
        return this.server;
    }

    /**
     * create session object for app propeties
     * should happen only once,dont forget to destroy this session object
     * then later
     */
    private get appProperties() {
        if (!this.appPropertiesSessionObject) {
            this.appPropertiesSessionObject = this.resolveProperties();
        }
        return this.appPropertiesSessionObject;
    }

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

    public get properties(): Promise<any> {
        return from(this.appProperties)
            .pipe(switchMap((sessionObj) => sessionObj.getProperties()))
            .toPromise();
    }

    public async getRemoteScript(): Promise<string> {
        const doc = await this.document;
        return await doc.getScript(); // script from server
    }

    /**
     * get script for current application
     *
     * 1. check if cached and return last cached version
     * 2. if not existis get last saved version of the script from the properties
     * 3. by default return remote script
     */
    public async getScript(): Promise<string> {
        if (!this.script) {
            const remoteScript = await this.getRemoteScript();
            const appProps = await this.properties;
            this.script = appProps.vsqlik?.script || remoteScript;
        }
        return this.script ?? '';
    }

    /**
     * set script to null so next time we fetch the script we got it from server
     */
    public async releaseScript(): Promise<void> {
        this.script = null;
    }

    /**
     * update only cached script
     * this only happens if the server emits changes but we do not have touched this
     * yet
     */
    public async updateScript(content: string): Promise<void> {
        this.script = content;
    }

    /**
     * update property on application
     * @param content what should be written
     * @param key the key which should be written
     */
    public async updateProperty(content: string, key = "script"): Promise<void> {
        const doc = await this.doc;
        const currrentData = await this.properties;
        currrentData.vsqlik = { [key]: content };

        await (await this.appProperties).setProperties(currrentData);
    }

    /**
     * persist script on server
     */
    public async writeScript(): Promise<void> {
        const doc = await this.doc;
        await doc.setScript(this.script ?? '');
    }

    /**
     * trigger app to do a save
     */
    public async save(): Promise<void> {
        const doc = await this.doc;
        doc.doSave();
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
     * create a warm observeable which registers once on app changed event
     * if the the first one subscribe, for unsusubscript if no listeners left
     * unregister again from app changed event until a new one registers
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

                if (this.observerCount === 0) {
                    this.unregisterOnDocumentChange();
                }
            };
        });
    }

    /**
     * resolve session object for object properties
     */
    private async resolveProperties(): Promise<EngineAPI.IGenericObject> {

        const doc = await this.document;
        const sessionObj = await doc.createSessionObject({
            qInfo: {qType: "AppPropsList"},
            qAppObjectListDef: { qType: "appprops" }
        });

        const listData = await sessionObj.getLayout() as any;
        const objectId = listData.qAppObjectList.qItems[0].qInfo.qId;
        const properties = doc.getObject(objectId);

        doc.destroySessionObject(sessionObj.id);
        return properties;
    }

    private onDocumentChange() {
        this.appChange$.next();
    }

    /**
     * register on document changed event
     */
    private async registerOnDocumentChange() {
        const doc = await this.document;
        doc.on("changed", this.onDocumentChange.bind(this));
    }

    /**
     * unregister from document changed event
     */
    private async unregisterOnDocumentChange() {
        const doc = await this.document;
        (doc as any).removeListener("changed", this.onDocumentChange.bind(this));
    }
}
