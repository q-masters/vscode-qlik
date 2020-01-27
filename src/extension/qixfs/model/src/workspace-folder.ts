import { EnigmaSession } from "@extension/enigma";

/**
 * davon reicht eine die dann geshared wird
 * müssen ja auch die route dahin kennen und hier wirds komplizierter
 */

/** 
 * davon gibt es viele
 */
export class QixWorkspaceFolder {

    private _connection: EnigmaSession;

    /** file system entry points */
    private entryMap: Map<string, any> = new Map();

    public constructor(connection: any) {
        this._connection = new EnigmaSession(
            connection.host, connection.port, connection.secure
        );
    }

    public get connection(): EnigmaSession {
        return this._connection;
    }

    public destroy() {
    }
}
