import { Directory, File } from "./directory";
import { Uri, FileType, FileSystemError } from "vscode";
import { EnigmaProvider } from "extension/utils";
import { AppDirectory } from "./app-directory";

export class DocumentsDirectory extends Directory {

    public constructor(
        private provider: EnigmaProvider
    ) {
        super();
    }

    /** 
     * ich weiß das hier ist qlik
     * da brauch ich auch meine Qlik Verbindung hier
     */
    find(uri: Uri): Directory | File {
        const parts    = uri.path.split("/").filter((segment) => segment !== "");
        const required = parts.slice(1);
        const needle   = parts[0];
        const entry = this.entries.get(needle);

        if (!entry) {
            throw FileSystemError.FileNotFound()
        }

        if (entry instanceof File) {
            throw FileSystemError.FileNotADirectory();
        }

        if (entry && required.length) {
            return entry.find(uri.with({path: required.join("/")}));
        }

        return entry;
    }

    readFile(): Promise<Uint8Array> {
        return Promise.resolve(Buffer.from(""));
    }

    createDirectory(): void {
        // @todo create new app
    }

    deleteDirectory(): void {
        // @todo delete app
    }

    public async readDirectory(): Promise<[string, FileType][]> {
        const session = await this.provider.connect();
        const docList: EngineAPI.IDocListEntry[] = await session.getDocList() as any;
        const content: [string, FileType][] = [];

        docList.forEach((doc) => {
            this.createAppDirectory(doc);
            content.push([doc.qTitle, FileType.Directory]);
        });

        return content;
    }

    private createAppDirectory(doc: EngineAPI.IDocListEntry): void {
        const directory = new AppDirectory(this.provider, doc);
        this.entries.set(doc.qTitle, directory);
    }
}
