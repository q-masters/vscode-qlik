import { Directory, File } from "./directory";
import { Uri, FileType, FileSystemError } from "vscode";
import { EnigmaProvider } from "extension/utils";

export class AppDirectory extends Directory {

    public constructor(
        private enigmaProvider: EnigmaProvider,
        private name: string,
        private id: string
    ) {
        super();
    }

    createFile(name, content: Uint8Array) {
        const file   = new File();
        file.content = content;
        this.entries.set(name, file);
    }

    async destroy(): Promise<void> {
        this.entries.clear();
        /** close session */
        this.enigmaProvider.closeApp(this.id);
    }

    find(uri: Uri): Directory | File {
        return this.entries.get("main.qvs") as File;
    }

    async writeFile(fileName, content: string | Uint8Array): Promise<void> {

        if (!this.entries.has(fileName)) {
            throw FileSystemError.NoPermissions(`Could not create new File: ${fileName}`);
        }

        const file = this.entries.get(fileName) as File;
        file.write(content)

        const app = await this.enigmaProvider.openApp(this.id);
        await app.setScript(file.read().toString());
        await app.doSave();
    }

    async readFile(): Promise<Uint8Array> {

        const app  = await this.enigmaProvider.openApp(this.id);
        const script = await app.getScript();
        const data = Buffer.from(script, "utf8");

        if (!this.entries.has("main.qvs")) {
            this.createFile("main.qvs", data);
        } else {
            const file = this.entries.get("main.qvs") as File;
            file.content = data;
        }
        return data;
    }

    async readDirectory(): Promise<[string, FileType][]> {
        if (!this.entries.has("main.qvs")) {
            this.createFile("main.qvs", Buffer.from(""));
        }
        return [["main.qvs", FileType.File]];
    }
}
