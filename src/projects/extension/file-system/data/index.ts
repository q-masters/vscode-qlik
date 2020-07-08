export * from "../entry/qix/qixfs-entry";
export * from "./routes";

export enum EntryType {
    APPLICATION,
    MEASURE,
    STREAM,
    SHEET,
    VARIABLE,
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
