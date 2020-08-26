import { singleton } from "tsyringe";
import { QixListProvider, DataNode } from "./qix-list.provider";
import deepmerge from "deepmerge";

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
export class QixDimensionProvider extends QixListProvider {

    /**
     * @inheritdoc
     */
    protected listProperties: EngineAPI.IGenericDimensionsListProperties = {
        qInfo: {
            qType: "DimensionList"
        },
        qDimensionListDef: {
            qType: 'dimension',
            qData: {
                "grouping": "/qDim/qGrouping",
                "info": "/qDimInfos"
            }
        }
    };

    public createProperties(name: string): EngineAPI.IGenericDimensionProperties {
        const data = {
            qMetaDef: {
                title: name
            }
        };
        return deepmerge.all([DimensionSkeleton, data], {clone: true}) as EngineAPI.IGenericDimensionProperties;
    }

    /**
     * @inheritdoc
     */
    protected getObject<DataNode>( app: EngineAPI.IApp, id: string): Promise<DataNode> {
        return app.getDimension(id) as Promise<unknown> as Promise<DataNode>;
    }

    /**
     * @inheritdoc
     * @todo improve typings
     */
    protected extractListItems<T>( layout: any): T[] {
        return layout.qDimensionList.qItems;
    }

    /**
     * @inheritdoc
     * @todo got a little problem with typings enigmaJS.IGeneratedAPI EngineAPI.IGeneratedAPI exists
     *       but createMeasure() return value extends from enigmaJS.IGeneratedAPI which is bad
     */
    protected createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericDimensionProperties): Promise<any> {
        return app.createDimension(properties);
    }

    /**
     * destroy a measure
     */
    protected async delete(app: EngineAPI.IApp, object: string): Promise<boolean> {
        return app.destroyDimension(object);
    }
}
