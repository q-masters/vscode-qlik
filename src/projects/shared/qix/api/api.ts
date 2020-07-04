export interface DoclistEntry extends EngineAPI.IDocListEntry {
    qMeta: DoclistEntryMeta;
}

export interface DoclistEntryMeta extends EngineAPI.INxMeta {

    canCreateDataConnections: boolean;

    create: any;

    /**
     * date time string
     */
    createdDate: string;

    description: string;

    dynamicColor: string;

    modifiedDate: string;

    privileges: string[];

    published: boolean;

    publishedTime: string;

    stream: {
        id: string;

        name: string;
    };

    qThumbnail: {
        qUrl: string;
    };

    qTitle: string
}
