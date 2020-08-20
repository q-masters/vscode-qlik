import { singleton } from "tsyringe";
import { Connection } from "projects/extension/connection/utils/connection";
import { QixListProvider, DataNode } from "./qix-list.provider";

@singleton()
export class QixSheetProvider  extends QixListProvider {

    /**
     * @inheritdoc
     */
    protected listProperties = {
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
    };

    public createProperties(): DataNode {
        return {};
    }

    /**
     * write full property tree
     *
     * @override
     */
    public async update(connection: Connection, app_id: string, sheet_id: string, content: EngineAPI.IGenericObjectEntry): Promise<void> {
        const session = await connection.openSession(app_id);
        const app     = await session?.openDoc(app_id) as EngineAPI.IApp;
        const sheet   = await app?.getObject(sheet_id);

        return await sheet?.setFullPropertyTree(content);
    }

    protected extractListItems(layout: any): any[] {
        return layout.qAppObjectList.qItems as any[];
    }

    protected getObject(app: EngineAPI.IApp, id: string): Promise<DataNode> {
        return app.getObject(id) as Promise<unknown> as Promise<DataNode>;
    }

    protected createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericProperties): Promise<EngineAPI.IGenericObject> {
        return app.createSessionObject(properties);
    }

    protected delete(app: EngineAPI.IApp, object: string): Promise<boolean> {
        return app.destroyObject(object);
    }
}
