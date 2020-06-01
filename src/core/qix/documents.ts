import { EnigmaSession } from "@core/connection";
import { singleton } from "tsyringe";

@singleton()
export class QixDocumentProvider {

    /**
     * read all qlik documents (apps) from enigma session
     */
    public async list(connection: EnigmaSession): Promise<any> {
        try {
            const session    = await connection.open();
            const docList: EngineAPI.IDocListEntry[] = await session?.getDocList() as any ?? [];
            return docList;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    /**
     * create new app
     */
    public async create(connection: EnigmaSession, name: string): Promise<void> {
        const session = await connection.open();

        if (session) {
            await session.createApp(name);
        }
    }

    /**
     * delete app
     */
    public async delete(connection: EnigmaSession, appId: string): Promise<void> {
        /** first close session on app */
        await connection.close(appId);

        /** get global and delete app */
        const session = await connection.open();
        if (session) {
            await session.deleteApp(appId);
        }
    }
}
