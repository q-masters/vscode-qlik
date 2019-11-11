export interface QlikApp {

    id: string;

    name: string;

    script: string;
}

export interface QlikConnector {

    createApp(name: string): Thenable<EngineAPI.IApp>;

    deleteApp(id: string): Thenable<void>;

    readAppList(): Promise<QlikApp[]>;

    readScript(appId: string): Thenable<string>;

    writeScript(appId: string, script: string): Thenable<boolean>;
}
