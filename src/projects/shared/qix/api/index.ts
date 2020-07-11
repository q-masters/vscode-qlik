export const variableDef: EngineAPI.IGenericVariableListProperties = {
    qInfo: {
        qType: "VariableList",
        qId: ""
    },
    qVariableListDef: {
        qShowConfig: false,
        qShowReserved: false,
        qType: "variable",
        qData: {
            tags: "/tags"
        }
    }
};

/**
 * configuration for measure list object
 *
 */
export const dimensionListProperties: EngineAPI.IGenericDimensionsListProperties = {
    qInfo: {
        qType: 'DimensionList'
    },
    qDimensionListDef: {
        qType: 'dimension',
        qData: {
            'title': '/title'
        }
    }
};

export interface IVariableListItem {
    qName: string;
    qDefinition: string;
    qMeta: {
        privileges: Array<string>;
    },
    qInfo: {
        qId: string,
        qType: "variable"
    },
    qData: {
        tags: string
    }
}
