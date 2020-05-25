import { QixFsFileAdapter } from "./src/entry";
import * as vscode from "vscode";
import { RouteParam } from "../utils";
import YAML from "yaml";

export class SheetFile extends QixFsFileAdapter {

    public async writeFile(uri: vscode.Uri, content: Uint8Array, params: RouteParam): Promise<void> {
        const app    = await this.openApp(uri, this.extractAppId(params.app));
        const parsed = params.sheet.split(/\n/);

        if (parsed && parsed[1]) {
            const sheetId = parsed[1].match(/(.*?)\..*$/);

            if (!sheetId) {
                return;
            }

            const data: EngineAPI.IGenericObjectEntry = YAML.parse(content.toString());
            const sheet = await app?.getObject(sheetId[1]);
            return await sheet?.setFullPropertyTree(data);
        }

        throw new Error("something failed");
    }

    public async stat(): Promise<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.File,
        };
    }

    public async readFile(uri: vscode.Uri, params: RouteParam): Promise<Uint8Array> {
        const app    = await this.openApp(uri, this.extractAppId(params.app));
        const parsed = params.sheet.split(/\n/);

        if (parsed && parsed[1]) {
            const sheetId = parsed[1].match(/(.*?)\..*$/);

            if (!sheetId) {
                return Buffer.from("Could not open sheet");
            }

            const sheet = await app?.getObject(sheetId[1]);
            const sheetData = await sheet?.getFullPropertyTree();
            return Buffer.from(YAML.stringify(sheetData, { indent: 4}));
        }

        throw new Error("something failed");
    }
}
