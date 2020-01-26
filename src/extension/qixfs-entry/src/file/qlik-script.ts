import { QixFsFile } from "../entry";
import * as vscode from "vscode";
import { RouteParam } from "@qixfs/utils/router";

export class QlikScriptFile extends QixFsFile {

    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        console.log("write me now ?");
        const connection = this.getConnection(uri);
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

    /**
     * by default this should be a directory operation only in my opinion
     */
    public rename(connection: any, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {
        return await this.getScriptData(uri, params.app);
    }

    /**
     * get script data from current app
     */
    private async getScriptData(uri: vscode.Uri, appId: string): Promise<Buffer> {
        const connection = this.getConnection(uri);
        const app        = await connection.open(appId);
        const script     = await app.getScript();
        const data       = Buffer.from(script, "utf8");
        return data;
    }
}
