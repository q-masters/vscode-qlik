import { singleton } from "tsyringe";
import { EnigmaSession } from "@shared/connection";
import { Observable, from, of } from "rxjs";
import { switchMap, take } from "rxjs/operators";

@singleton()
export class QixApplicationProvider {

    public async exists(connection: EnigmaSession, id: string): Promise<boolean> {
        /*
        const docList = await this.list(connection);
        return docList.some((entry) => entry.qDocId === id);
        */
    }

    /**
     * read all qlik documents (apps) from enigma session, we currently cache the current connection
     */
    public list(connection: EnigmaSession): Observable<EngineAPI.IDocListEntry[]> {
        return from(connection.open()).pipe(
            switchMap((session) => session ? from(session.getDocList() as any as Promise<EngineAPI.IDocListEntry[]>) : of([])),
            take(1)
        );
    }

    /**
     * read script from app
     */
    public async readScript(connection: EnigmaSession, id: string): Promise<string | undefined> {
        const session = await connection.open(id);
        const app     = await session?.openDoc(id);
        return await app?.getScript();
    }

    /**
     * write script to app
     */
    public async writeScript(connection: EnigmaSession, id: string, content: string): Promise<void> {

        const session = await connection.open(id);
        const app     = await session?.openDoc(id);

        if (app) {
            await app.setScript(content.toString());
            await app.doSave();
        }
    }

    /**
     * create a new app
     */
    public createApp(connection: EnigmaSession, name: string): Observable<unknown> {
        return from(connection.open()).pipe(
            switchMap((global: EngineAPI.IGlobal) => global.createApp(name))
        );
    }

    /**
     * delete app
     */
    public async deleteApp(connection: EnigmaSession, appId: string): Promise<void>
    {
        /** first close session on app */
        await connection.close(appId);

        /** get global and delete app */
        const session = await connection.open();
        if (session) {
            await session.deleteApp(appId);
        }
    }

    /**
     * rename existing app
     *
     * @param connection enigma sesssion
     * @param id id of the app which should renamed
     * @param name the new name of the app
     */
    public async renameApp(connection: EnigmaSession, id: string, name: string): Promise<void> {

        /** get global and delete app */
        const session = await connection.open(id);
        const app     = await session?.openDoc(id);

        const properties = await app?.getAppProperties();
        const newProperties = {...properties, qTitle: name} as EngineAPI.INxAppProperties;

        await app?.setAppProperties(newProperties);
    }

    /**
     * get app data
     */
    public getAppData(connection: EnigmaSession, id: string): Observable<EngineAPI.IAppEntry> {
        return from(connection.open()).pipe(
            switchMap((global: EngineAPI.IGlobal) => global.getAppEntry(id))
        );
    }
}
