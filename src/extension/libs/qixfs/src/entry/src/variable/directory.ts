import * as vscode from "vscode";
import { QixFsDirectoryAdapter } from "../entry";
import { RouteParam } from "../../../utils";
import { posix } from "path";

const variableDef: EngineAPI.IGenericVariableListProperties = {
    qInfo: {
        qType: "VariableList",
        qId: ""
    },
    qVariableListDef: {
        qShowConfig: false,
        qShowReserved: false,
        qType: "variable",
        qData: {
            tags: "/tags"
        }
    }
};

interface IVariableListItem {
    qName: string;
    qDefinition: string;
    qMeta: {
        privileges: Array<string>;
    },
    qInfo: {
        qId: string,
        qType: "variable"
    },
    qData: {
        tags: string
    }
}

export class VariableDirectory extends QixFsDirectoryAdapter {

    public async delete(uri: vscode.Uri, name: string, params: RouteParam): Promise<void> {

        const appId = this.extractAppId(params.app);

        const connection = await this.getConnection(uri);
        const session    = await connection.open(appId);

        if (session) {
            const app     = await session.openDoc(appId);
            const varName = name.substr(0, name.indexOf(posix.extname(name)));

            await app.destroyVariableByName(varName);
            await app.doSave();
        }
    }

    public async readDirectory(uri: vscode.Uri, params: RouteParam): Promise<[string, vscode.FileType][]> {

        const appId = this.extractAppId(params.app);

        const connection   = await this.getConnection(uri);
        const session      = await connection.open(appId);
        const app          = await session?.openDoc(appId);

        if (app) {
            const listObject   = await app.createSessionObject(variableDef);
            const layout       = await listObject.getLayout() as any;
            const variableList = layout.qVariableList.qItems as IVariableListItem[];

            app.destroySessionObject(listObject.id);

            const result = variableList.map<[string, vscode.FileType.File]>((variable) => {
                return [`${variable.qName}.yaml`, vscode.FileType.File];
            });
            return result;
        }

        return [];
    }

    stat(): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        };
    }
}
