import { RouteParam } from "@qixfs/utils/router";
import * as vscode from "vscode";
import { QixFsDirectory } from "../entry";
import { posix } from "path";

export class DocumentsDirectory extends QixFsDirectory {

    /**
     * read all qlik documents (apps) from enigma session
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        try {
            const session = await this.getConnection(uri).open();
            const docList: EngineAPI.IDocListEntry[] = await session.getDocList() as any;
            return docList.map<[string, vscode.FileType]>((doc) => [doc.qTitle, vscode.FileType.Directory]);
        } catch (error) {
            return [];
        }
    }

    /**
     * create new app
     */
    public async createDirectory(uri: vscode.Uri, name: string, params: RouteParam): Promise<void> {
        const session = await this.getConnection(uri).open();
        await session.createApp(name);
    }

    delete(connection: any, params: RouteParam, options: { recursive: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }

    stat(connection: any): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        }
    }

    rename(connection: any, oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean; }): void | Thenable<void> {
        throw new Error("Method not implemented.");
    }
}
