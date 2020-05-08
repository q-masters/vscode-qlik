import * as vscode from "vscode";
import { RouteParam } from "../../../utils";
import { QixFsFileAdapter } from "../entry";

export class ScriptFile extends QixFsFileAdapter {

    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {

        const connection = await this.getConnection(uri);
        const session   = await connection.open(params.app);
        const app       = await session?.openDoc(params.app);

        if (app) {
            await app.setScript(content.toString());
            await app.doSave();
        }
    }

    public async stat(): Promise<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.File,
        }
    }

    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {
        return await this.getScriptData(uri, params.app);
    }

    /**
     * get script data from current app
     */
    private async getScriptData(uri: vscode.Uri, appId: string): Promise<Buffer> {
        const connection = await this.getConnection(uri);
        const session    = await connection.open(appId);
        const app        = await session?.openDoc(appId);
        const script     = await app?.getScript() ?? "not found";
        const data       = Buffer.from(script, "utf8");
        return data;
    }
}
