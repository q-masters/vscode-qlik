import { QixFile } from "../qix/qix.file";
import {  EntryType } from "@vsqlik/fs/data";
import { inject } from "tsyringe";
import { FileSystemHelper } from "@vsqlik/fs/utils/file-system.helper";
import { QixSheetProvider } from "@core/qix/utils/sheet.provider";

export class SheetFile extends QixFile {

    protected entryType = EntryType.SHEET;

    public constructor(
        @inject(QixSheetProvider) provider: QixSheetProvider,
        @inject(FileSystemHelper) filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper, provider);
    }
}
