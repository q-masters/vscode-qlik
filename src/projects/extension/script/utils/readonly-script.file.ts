import * as vscode from "vscode";
import { QixFsFileAdapter } from "@vsqlik/fs/data";
import { container } from "tsyringe";
import { DocumentRepository } from "./document.repository";

/**
 * is used for remote script files we are require in a diff,
 * this file should be only readonly
 */
export class ReadonlyScriptFileCtrl extends QixFsFileAdapter {

    readFile(uri: vscode.Uri): Uint8Array {
        const repository = container.resolve(DocumentRepository);
        try {
            return Buffer.from(repository.provideTextDocumentContent(uri));
        } catch (error) {
            return Buffer.from("could not fetch remote script data");
        }
    }

    stat(): vscode.FileStat {
        return {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: vscode.FileType.File
        };
    }

    /** simply does nothing */
    writeFile(): void {
        return;
    }

    delete(): void {
        return;
    }
}
