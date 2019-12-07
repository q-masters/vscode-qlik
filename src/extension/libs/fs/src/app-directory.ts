import { Directory, File } from "./directory";
import { Uri, FileType } from "vscode";
import { EnigmaProvider } from "extension/utils";

export class AppDirectory extends Directory {

    public constructor(
        private enigmaProvider: EnigmaProvider,
        private doc: EngineAPI.IDocListEntry
    ) {
        super();
    }

    find(uri: Uri): Directory | File {
        return this.entries.get("main.qvs") as File;
    }

    writeFile(): void {
        /** @todo write script file */
    }

    async readFile(): Promise<Uint8Array> {
        const app  = await this.enigmaProvider.openApp(this.doc.qDocId);
        const data = Buffer.from(await app.getScript(), "utf8");
        (this.entries.get("main.qvs") as File).content = data;
        return data;
    }

    async readDirectory(): Promise<[string, FileType][]> {
        /**
         * allready create file, vscode will get first stat of file
         * no file no stat but error message shown.
         * 
         * So create an empty file to avoid exception thrown.
         */
        this.entries.set("main.qvs", new File());
        return [["main.qvs", FileType.File]];
    }
}
