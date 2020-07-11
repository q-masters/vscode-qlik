import { singleton } from "tsyringe";
import { QixListProvider, DataNode } from "./qix-list.provider";

export interface MeasureProperties {
    qInfo: {
        qId: string,
        qType: "measure"
    },
    qMeasure: {
        qLabel: string,
        qDef: string,
        qGrouping: number,
        qExpressions: any[],
        qActiveExpression: number,
        qLabelExpression: string
    },
    qMetaDef: DataNode
}

export const MeasureSkeleton: MeasureProperties = {
    qInfo: {
        qId: "",
        qType: "measure"
    },
    qMeasure: {
        qLabel: "",
        qDef: "",
        qGrouping: 0,
        qExpressions: [],
        qActiveExpression: 0,
        qLabelExpression: ""
    },
    qMetaDef: {}
};

@singleton()
export class QixMeasureProvider extends QixListProvider {

    /**
     * @inheritdoc
     */
    protected listProperties: EngineAPI.IGenericMeasureListProperties = {
        qInfo: {
            qType: 'MeasureList'
        },
        qMeasureListDef: {
            qType: 'measure',
        }
    };

    public createMeasureProperties(name: string): MeasureProperties {
        return Object.assign(
            {},
            MeasureSkeleton,
            {
                qMeasure: {
                    qLabel: name
                },
                qMetaDef: {
                    title: name
                }
            }
        );
    }

    /**
     * @inheritdoc
     */
    protected getObject<DataNode>( app: EngineAPI.IApp, id: string): Promise<DataNode> {
        return app.getMeasure(id) as Promise<unknown> as Promise<DataNode>;
    }

    /**
     * @inheritdoc
     * @todo improve typings
     */
    protected extractListItems<T>( layout: any): T[] {
        return layout.qMeasureList.qItems;
    }

    /**
     * @inheritdoc
     * @todo got a little problem with typings enigmaJS.IGeneratedAPI EngineAPI.IGeneratedAPI exists
     *       but createMeasure() return value extends from enigmaJS.IGeneratedAPI which is bad
     */
    protected createObject(app: EngineAPI.IApp, properties: EngineAPI.IGenericMeasureProperties): Promise<any> {
        return app.createMeasure(properties);
    }
}
