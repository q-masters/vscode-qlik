import { QlikConnector, QlikApp } from "./connector";

/**
 * 
 * Rest Connector for Qlik (QRS or anything else)
 */
export class RestConnector implements QlikConnector {

    public constructor( 
        private uri: string,
        private userName: string,
        private passWord: string
    ) {}

    createApp(name: string): Thenable<EngineAPI.IApp> {
        throw new Error("Method not implemented.");
    }

    deleteApp(id: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    async readAppList(): Promise<QlikApp[]> {
        return [{
            id: "1-2-3-4",
            name: "app 1",
            script: ""
        }, {
            id: "2-3-4-5",
            name: "app-2",
            script: ""
        }];
    }

    readScript(appId: string): Thenable<string> {
        throw new Error("Method not implemented.");
    }

    writeScript(appId: string, script: string): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

}
