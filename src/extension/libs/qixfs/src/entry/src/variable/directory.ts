import * as vscode from "vscode";
import { QixFsDirectory, QixFsDirectoryAdapter } from "../entry";
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
        const connection = await this.getConnection(uri);
        const app        = await connection.open(params.app);
        const varName    = name.substr(0, name.indexOf(posix.extname(name)));

        try {
            await app.destroyVariableByName(varName);
            await app.doSave();
        } catch (error) {
            vscode.window.showErrorMessage(`Could not delete Variable: ${varName}`);
            throw vscode.FileSystemError.NoPermissions;
        }
    }

    public async readDirectory(uri: vscode.Uri, params: RouteParam): Promise<[string, vscode.FileType][]> {

        const connection   = await this.getConnection(uri);
        const session      = await connection.open(params.app);
        const listObject   = await session.createSessionObject(variableDef);
        const layout       = await listObject.getLayout() as any;
        const variableList = layout.qVariableList.qItems as IVariableListItem[];

        session.destroySessionObject(listObject.id);

        const result = variableList.map<[string, vscode.FileType.File]>((variable) => {
            return [`${variable.qName}.yaml`, vscode.FileType.File]
        });

        return result;
    }

    stat(uri: vscode.Uri, params?: RouteParam | undefined): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 1,
            type: vscode.FileType.Directory
        }
    }
}
