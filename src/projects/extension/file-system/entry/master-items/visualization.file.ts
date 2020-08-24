
import { inject, injectable } from "tsyringe";
import { EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import { QixVisualizationProvider } from "@core/qix/utils/visualization.provider";

@injectable()
export class VisualizationFile extends QixFile {

    protected entryType = EntryType.VISUALIZATION;

    public constructor(
        @inject(QixVisualizationProvider) provider: QixVisualizationProvider,
        @inject(FileSystemHelper) filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper, provider);
    }
}
