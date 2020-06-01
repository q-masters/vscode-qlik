import { EnigmaSession } from "@core/connection";
import { singleton } from "tsyringe";

@singleton()
export class QixDocumentProvider {

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
