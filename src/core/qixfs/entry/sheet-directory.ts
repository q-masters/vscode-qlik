import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "./entry";
import { RouteParam } from "../utils";

export class SheetDirectory extends QixFsDirectoryAdapter {

    public async readDirectory(uri: vscode.Uri, params: RouteParam): Promise<[string, vscode.FileType][]> {

        const appId = this.extractAppId(params.app);

        const connection   = await this.getConnection(uri);
        const session      = await connection.open(appId);
        const app          = await session?.openDoc(appId);

        if (app) {
            const listObject   = await app.createSessionObject({
                qInfo: {
                    qType: "SheetList"
                },
                qAppObjectListDef: {
                    qType: "sheet",
                    qData: {
                        title: "/qMetaDef/title",
                        description: "/qMetaDef/description"
                    }
                }
            });

            /** @todo type not exists */
            const layout = await listObject.getLayout() as any;
            const sheetList = layout.qAppObjectList.qItems as any[];

            return sheetList.map<[string, vscode.FileType]>((sheet) => [
                `${sheet.qData.title}\n${sheet.qInfo.qId}.yaml`, vscode.FileType.File
            ]);
        }

        return [];
    }

    public stat(): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        };
    }
}
