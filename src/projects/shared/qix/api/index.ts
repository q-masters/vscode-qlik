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
