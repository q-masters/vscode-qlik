import { singleton } from "tsyringe";
import { EnigmaSession } from "@shared/connection";

@singleton()
export class ApplicationService {

    public exists(connection: EnigmaSession, id: string): Promise<boolean> {
        return connection.isApp(id);
    }

    /**
     * read script from app
     */
    public async readScript(connection: EnigmaSession, id: string): Promise<string | undefined> {
        const session = await connection.open(id);
        const app     = await session?.openDoc(id);
        return app?.getScript();
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

    public readVariable() {
    }

    public writeVariable() {
    }

    public deleteVariable() {
    }
}
