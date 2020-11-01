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
        const app   = await connection?.getApplication(app_id);
        const doc   = await app?.document;
        const sheet = await doc?.getObject(sheet_id);

        return await sheet?.setFullPropertyTree(content);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
