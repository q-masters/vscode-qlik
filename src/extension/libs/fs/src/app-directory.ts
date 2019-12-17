import { Directory, File } from "./directory";
import { Uri, FileType, FileSystemError, commands } from "vscode";
import { EnigmaSessionManager } from "extension/utils/enigma-session";
import { QixFsCommands } from "./qix-fs";

export class AppDirectory extends Directory {

    private tmpSymLinks: Map<string, File> = new Map();

    public constructor(
        private enigmaProvider: EnigmaSessionManager,
        private name: string,
        private id: string
    ) {
        super();
    }

    createFile(name, content: Uint8Array, temporary = false) {
        const file   = new File();
        file.content = content;
        this.entries.set(name, file);
    }

    async destroy(): Promise<void> {
        this.entries.clear();
        await this.enigmaProvider.close(this.id);
    }

    find(uri: Uri): Directory | File {
        const name = uri.path;
        if (this.entries.has(name)) {
            return this.entries.get(name) as File;
        }

        if (this.tmpSymLinks.has(name)) {
            return this.tmpSymLinks.get(name) as File;
        }

        throw FileSystemError.FileNotFound();
    }

    delete(name: string): Promise<void> {
        return Promise.resolve();
    };

    async writeFile(name: string, content: string | Uint8Array): Promise<void> {
        if (!this.entries.has(name)) {
            this.tmpSymLinks.set(name, this.entries.get("main.qvs") as File);
        }

        const file = this.entries.get("main.qvs") as File;
        file.write(content)

        const app = await this.enigmaProvider.open(this.id);
        await app.setScript(file.read().toString());
        await app.doSave();
    }

    async readFile(name: string): Promise<Uint8Array> {

        if (this.tmpSymLinks.has(name)) {
            /** 
             * we want to read a temporay file, this can only happens if we copy paste a file into this directory
             * we could not delete file directly and have to execute our script after write process has been finished
             * run script with timeout 0 to ensure it is executed after current cycle
             */
            setTimeout(() => {
                commands.executeCommand("workbench.action.closeActiveEditor");
                commands.executeCommand(QixFsCommands.DELETE_FILE_COMMAND, Uri.parse(`qix:/${this.name}/${name}`));
                this.tmpSymLinks.delete(name);
            }, 0)

            // return empty content since we dont care
            return Buffer.from("");
        }

        const app    = await this.enigmaProvider.open(this.id);
        const script = await app.getScript();
        const data   = Buffer.from(script, "utf8");

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
