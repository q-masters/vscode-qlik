import { ConnectionHelper, ConnectionProvider } from "@core/public.api";
import { EntryType } from "@vsqlik/fs/data";
import { container } from "tsyringe";
import * as vscode from "vscode";

const connectionProviver = container.resolve(ConnectionProvider);

export async function ScriptSynchronizeCommand(uri: vscode.Uri, script: string): Promise<void> {
    try {
        /** get required data, connection, app and the text editor which contains the script */
        const connection = await connectionProviver.resolve(uri);
        const appEntry   = connection?.fileSystem.parent(uri, EntryType.APPLICATION);

        if (!connection || !appEntry) {
            return;
        }

        const session = ConnectionHelper.createEnigmaSession(connection.model, appEntry.id, false);
        const global  = await session.open() as EngineAPI.IGlobal;
        const app     = await global.openDoc(appEntry.id);

        await app.setScript(script);
        await app.getAppLayout();
        await app.doSave();
        await session.close();
    } catch (error) {
        console.log(error);
    }
}
