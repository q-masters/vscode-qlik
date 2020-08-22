import { inject, injectable } from "tsyringe";
import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import { QixDimensionProvider } from "@core/qix/utils/dimension.provider";

@injectable()
export class DimensionFile extends QixFile {

    protected entryType = EntryType.DIMENSION;

    public constructor(
        @inject(QixDimensionProvider) provider: QixDimensionProvider,
        @inject(FileSystemHelper) filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper, provider);
    }
}
