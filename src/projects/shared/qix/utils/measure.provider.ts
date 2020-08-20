import { singleton } from "tsyringe";
import { QixListProvider, DataNode } from "./qix-list.provider";
import deepmerge from "deepmerge";
import { Connection } from "projects/extension/connection/utils/connection";

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

    public createProperties(name: string): MeasureProperties {
        const data = {
            qMeasure: {
                qLabel: name
            },
            qMetaDef: {
                title: name
            }
        };
        return deepmerge.all([MeasureSkeleton, data], {clone: true}) as MeasureProperties;
    }

    /**
     * rename measure
     */
    public async rename(connection: Connection, app: string, measure: string, newName: string) {
        const patch   = {
            qMeasure: {
                qLabel: newName,
            },
            qMetaDef: {
                title: newName
            }
        };
        return await this.patch(connection, app, measure, patch);
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

    /**
     * destroy a measure
     */
    protected async delete(app: EngineAPI.IApp, object: string): Promise<boolean> {
        return app.destroyMeasure(object);
    }
}
