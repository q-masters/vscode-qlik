export * from "../entry/qix/qixfs-entry";
export * from "./routes";

export enum EntryType {
    APPLICATION,
    DIMENSION,
    MEASURE,
    SCRIPT,
    SHEET,
    STREAM,
    VARIABLE,
    VISUALIZATION,
    UNKNOWN
}

export interface Entry {
    type: EntryType;

    readonly: boolean;

    id: string;

    data?: any;
}

export interface ApplicationEntry extends Entry {
    type: EntryType.APPLICATION;
}
