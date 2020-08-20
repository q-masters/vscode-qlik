import { inject, injectable } from "tsyringe";
import { QixMeasureProvider } from "@core/qix/utils/measure.provider";
import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";

@injectable()
export class MeasureFile extends QixFile {

    protected entryType = EntryType.MEASURE;

    public constructor(
        @inject(QixMeasureProvider) protected provider: QixMeasureProvider,
        @inject(FileSystemHelper) filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper, provider);
    }
}
