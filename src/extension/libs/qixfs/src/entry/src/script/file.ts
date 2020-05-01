import * as vscode from "vscode";
import { RouteParam } from "../../../utils";
import { QixFsFileAdapter } from "../entry";

export class ScriptFile extends QixFsFileAdapter {

    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        const connection = await this.getConnection(uri);
        const app        = await connection.open(params.app);
        await app.setScript(content.toString());
        await app.doSave();
    }

    public async stat(uri: vscode.Uri, params: RouteParam): Promise<vscode.FileStat> {
        const scriptData = await this.getScriptData(uri, params.app);
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: scriptData.byteLength,
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
        try {
        const connection = await this.getConnection(uri);
        const app        = await connection.open(appId);
        const script     = await app.getScript();
        const data       = Buffer.from(script, "utf8");
        return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
