import { Directory, File } from "./directory";
import { Uri, FileType, FileSystemError } from "vscode";
import { posix } from "path";
import { EnigmaSessionManager } from "extension/utils/enigma-session";
import { AppDirectory } from "./app-directory";

export class DocumentsDirectory extends Directory {

    public constructor(
        private provider: EnigmaSessionManager
    ) {
        super();
    }

    public destroy(): Promise<void> {
        return Promise.resolve();
    }

    /** 
     * @todo check we could implement this in abstract class as template method
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

    /**
     * creates a new app
     */
    async createDirectory(name: string): Promise<void> {
        const session = await this.provider.open();
        const result  = await session.createApp(name);
        this.createAppDirectory(name, posix.basename(result.qAppId))
    }

    /**
     * delete an app
     */
    async delete(name: string): Promise<void> {
        const entry = this.entries.get(name);

        if (!entry) {
            throw FileSystemError.FileNotFound();
        }

        /** we have to kill the session */
        await entry.destroy();

        const session = await this.provider.open();
        const deleted = await session.deleteApp(name);

        if (!deleted) {
            throw FileSystemError.NoPermissions(`Could not delete ${name}`);
        }
    }

    public async readDirectory(): Promise<[string, FileType][]> {
        const session = await this.provider.open();
        const docList: EngineAPI.IDocListEntry[] = await session.getDocList() as any;
        const content: [string, FileType][] = [];
        docList.forEach((doc) => {
            this.createAppDirectory(doc.qTitle, doc.qDocId);
            content.push([doc.qTitle, FileType.Directory]);
        });
        return content;
    }

    /**
     * create a new app directory if not allready exists
     */
    private createAppDirectory(name: string, id: string): void {
        if (!this.entries.has(name)) {
            const directory = new AppDirectory(this.provider, name, id);
            this.entries.set(name, directory);
        }
    }
}
