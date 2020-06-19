import { singleton } from "tsyringe";
import { EnigmaSession } from "@shared/connection";

@singleton()
export class QixApplicationProvider {

    public async exists(connection: EnigmaSession, id: string): Promise<boolean> {
        const docList = await this.list(connection);
        return docList.some((entry) => entry.qDocId === id);
    }

    /**
     * read all qlik documents (apps) from enigma session
     */
    public async list(connection: EnigmaSession): Promise<EngineAPI.IDocListEntry[]> {
        try {
            const session = await connection.open();
            const docList = await session?.getDocList() as unknown as EngineAPI.IDocListEntry[] ?? [];
            return docList;
        } catch (error) {
            console.error(error);
            return [];
        }
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
    public async createApp(connection: EnigmaSession, name: string): Promise<unknown> {
        const session = await connection.open();
        if (session) {
            return await session.createApp(name);
        }
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
        const app     = await session?.openDoc(id, void 0, void 0, void 0, true);

        const properties = await app?.getAppProperties();
        const newProperties = {...properties, qTitle: name} as EngineAPI.INxAppProperties;

        await app?.setAppProperties(newProperties);
    }
}
