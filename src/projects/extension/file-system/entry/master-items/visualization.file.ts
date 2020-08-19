
import { inject, injectable } from "tsyringe";
import { Entry, EntryType } from "../../data";
import { FileSystemHelper } from "../../utils/file-system.helper";
import { QixFile } from "../qix/qix.file";
import { Connection } from "projects/extension/connection/utils/connection";
import { QixVisualizationProvider } from "@core/qix/utils/visualization.provider";

@injectable()
export class VisualizationFile extends QixFile {

    protected entryType = EntryType.VISUALIZATION;

    public constructor(
        @inject(QixVisualizationProvider) private provider: QixVisualizationProvider,
        @inject(FileSystemHelper) private filesystemHelper: FileSystemHelper,
    ) {
        super(filesystemHelper);
    }

    /**
     * read data
     */
    protected async read(connection: Connection, app: string, entry: Entry): Promise<any> {
        return await this.provider.read(connection, app, entry.id);
    }
}
