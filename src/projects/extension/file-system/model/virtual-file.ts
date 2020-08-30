import { EOL } from "os";
import { Observable, Subject } from "rxjs";

export class VirtualFile {

    private content = '';

    private change$: Subject<void> = new Subject();

    private destroy$: Subject<boolean> = new Subject();

    private date = new Date();

    public get change(): Observable<void> {
        return this.change$.asObservable();
    }

    public get destroyed(): Observable<boolean> {
        return this.destroy$.asObservable();
    }

    public writeLn(line: string) {
        const time = this.date.toLocaleTimeString().match(/^[^\s]*/)?.[0] as string;
        this.content += EOL + time + ': ' + line;
        this.change$.next();
    }

    public read() {
        return this.content;
    }

    public dismiss() {
        this.destroy$.next(true);
        this.content = '';
    }
}
