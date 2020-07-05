export * from "../entry/qixfs-entry";
export * from "./routes";

export enum EntryType {
    APPLICATION,
    STREAM,
    SHEET,
    VARIABLE
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
