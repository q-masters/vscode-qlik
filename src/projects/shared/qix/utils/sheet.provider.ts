import { singleton } from "tsyringe";
import { Connection } from "projects/extension/connection/utils/connection";

@singleton()
export class QixSheetProvider  {

    public async list(connection: Connection, id: string): Promise<any[]> {
        const global = await connection.openSession(id);
        const app    = await global?.openDoc(id);

        if (!app) {
            return [];
        }

        const listObject = await app.createSessionObject({
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

        const layout = await listObject.getLayout() as any;
        return layout.qAppObjectList.qItems as any[];
    }

    /**
     * get full property tree data from sheet
     */
    public async read(connection: Connection, app_id: string, sheet_id: string): Promise<EngineAPI.IGenericObjectEntry> {
        const session = await connection.openSession(app_id);
        const app     = await session?.openDoc(app_id) as EngineAPI.IApp;
        const sheet   = await app?.getObject(sheet_id);

        return sheet?.getFullPropertyTree();
    }

    /**
     * write full property tree
     */
    public async write(connection: Connection, app_id: string, sheet_id: string, content: EngineAPI.IGenericObjectEntry): Promise<void> {
        const session = await connection.openSession(app_id);
        const app     = await session?.openDoc(app_id) as EngineAPI.IApp;
        const sheet = await app?.getObject(sheet_id);

        return await sheet?.setFullPropertyTree(content);
    }
}
