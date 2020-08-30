import * as vscode from 'vscode';
import { singleton } from 'tsyringe';
import { MemoryStorage } from '@core/storage';
import { takeUntil, debounceTime, finalize } from 'rxjs/operators';
import { VirtualFile } from '../model/virtual-file';

/**
 * general file provider for log files
 */
@singleton()
export class LogFileProvider implements vscode.TextDocumentContentProvider {

    private fileStorage : MemoryStorage<VirtualFile> = new MemoryStorage();

    private onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();

    public onDidChange = this.onDidChangeEmitter.event;

    public constructor() {
        /**
         * @todo implement as soon this is working again
         *
         * currently it seems this dosent triggers for virtual documents which are not
         * added to the workspace, so we never know it then it becomes closed.
         *
         * I think this is a bug in vscode itself since the example for content provider
         * is also not working correctly.
         *
            vscode.workspace.onDidCloseTextDocument(doc => console.log(doc));
         */
    }

    /**
     * called every time a change has triggered
     * or file is added to document
     */
    provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
        /** load file from storage */
        const file = this.fileStorage.read(uri.toString(true));
        return file?.read() ?? '';
    }

    /**
     * create new log file which can be written but only programatically
     */
    public create(uri: vscode.Uri): VirtualFile {
        const fileUri = uri.toString(true);
        const file = this.fileStorage.read(fileUri) ?? new VirtualFile();

        if (!this.fileStorage.exists(fileUri)) {
            this.fileStorage.write(fileUri, file);
            file.change
                .pipe(
                    takeUntil(file.destroyed),
                    debounceTime(20),
                    finalize(() => this.fileStorage.delete(fileUri))
                )
                .subscribe(() => this.update(uri));
        }

        return file;
    }

    /**
     *
     */
    public remove(uri: vscode.Uri) {
        console.log(uri);
    }

    /**
     *
     */
    public update(uri: vscode.Uri) {
        if (this.fileStorage.exists(uri.toString(true))) {
            this.onDidChangeEmitter.fire(uri);
        }
    }
}
