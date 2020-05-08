import * as vscode from "vscode";
import { RouteParam } from "../../../utils";
import { QixFsDirectoryAdapter } from "../entry";

export class DocumentsDirectory extends QixFsDirectoryAdapter {

    /**
     * read all qlik documents (apps) from enigma session
     */
    public async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
        try {
            const connection = await this.getConnection(uri)
            const session    = await connection.open();
            const docList: EngineAPI.IDocListEntry[] = await session?.getDocList() as any ?? [];

            return docList.map<[string, vscode.FileType]>((doc) => [doc.qDocId, vscode.FileType.Directory]);
        } catch (error) {
            console.log("error something went very bad");
            console.log(error);
            return [];
        }
    }

    /**
     * create new app
     */
    public async createDirectory(uri: vscode.Uri, name: string, params: RouteParam): Promise<void> {
        const connection = await this.getConnection(uri);
        const session = await connection.open();

        if (session) {
            await session.createApp(name);
        }
    }

    /** 
     * delete app
     */
    public async delete(uri: vscode.Uri, app: string): Promise<void> {
        /** first close session on app */
        const connection = await this.getConnection(uri);
        await connection.close(app)

        /** get global and delete app */
        const session = await connection.open();

        if (session) {
            await session.deleteApp(app);
        }
    }

    stat(): vscode.FileStat | Thenable<vscode.FileStat> {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 10,
            type: vscode.FileType.Directory
        }
    }
}
