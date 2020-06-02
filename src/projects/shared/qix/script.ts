import { singleton } from "tsyringe";
import { EnigmaSession } from "../connection";

@singleton()
export class QixScriptProvider {

    public async read(connection: EnigmaSession, appId: string) {
        const session    = await connection.open(appId);
        const app        = await session?.openDoc(appId);
        const script     = await app?.getScript() ?? "not found";
        const data       = Buffer.from(script, "utf8");
        return data;
    }

    public async write(connection: EnigmaSession, appId: string, content: Uint8Array) {
        const session    = await connection.open(appId);
        const app        = await session?.openDoc(appId);

        if (app) {
            await app.setScript(content.toString());
            await app.doSave();
        }
    }
}

/**
 * router weiß
 * endpoint: QixScript
 * params: [appId: string]
 */
