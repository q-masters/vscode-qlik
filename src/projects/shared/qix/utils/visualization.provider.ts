import { singleton } from "tsyringe";
import { QixListProvider, DataNode } from "./qix-list.provider";

@singleton()
export class QixVisualizationProvider extends QixListProvider {
    /**
     * @inheritdoc
     */
    protected listProperties: any = {
        qInfo: {
            qType: 'MasterObjectList'
        },
        qAppObjectListDef: {
            qData: {
                name: '/qMetaDef/title',
                visualization: '/visualization'
            },
            qType: 'masterobject'
        }
    };

    public createProperties(name: string): DataNode {
        return {
            qInfo: { qType: 'masterobject' },
            qMetaDef: { description: '', tags: '', title: name }
        };
    }


    /**
     * @inheritdoc
     * @todo improve typings
     */
    protected extractListItems<T>( layout: any): T[] {
        return layout.qAppObjectList.qItems;
    }

    protected getObject(app: EngineAPI.IApp, id: string): Promise<DataNode> {
        return app.getObject(id);
    }

    protected delete(app: EngineAPI.IApp, object: string): Promise<boolean> {
        return app.destroyObject(object);
    }

    protected async createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericProperties): Promise<EngineAPI.IGenericObject> {
        const masterObject = await app.createObject(properties);
        return masterObject;
    }
}
