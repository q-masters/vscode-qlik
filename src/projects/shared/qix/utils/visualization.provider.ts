import { singleton } from "tsyringe";
import { QixListProvider, DataNode } from "./qix-list.provider";

export const DimensionSkeleton: EngineAPI.IGenericDimensionProperties = {
    qInfo: {
        qId: "",
        qType: "dimension"
    },
    qDim: {
        qGrouping: "N",
        qFieldDefs: [
            ""
        ],
        qFieldLabels: [
            ""
        ],
        qLabelExpression: "",
    },
    qMetaDef: {
        title: "",
        description: "",
        tags: [
            ""
        ]
    }
};

@singleton()
export class QixVisualizationProvider extends QixListProvider {

    protected createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericProperties): Promise<EngineAPI.IGenericObject> {
        throw new Error("Method not implemented.");
    }

    protected delete(app: EngineAPI.IApp, object: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

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
}
