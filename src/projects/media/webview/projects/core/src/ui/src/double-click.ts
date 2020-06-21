import { Directive, Output, EventEmitter, OnInit, OnDestroy, ElementRef, Input } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { takeUntil, filter, buffer, debounceTime } from "rxjs/operators";

@Directive({
    selector: "[vsqlikDoubleClick]"
})
export class MouseDblClickDirective implements OnInit, OnDestroy {

    @Output()
    public dblClick: EventEmitter<any> = new EventEmitter();

    @Input()
    public delay = 250;

    private isDestroyed: Subject<boolean>;

    private el: ElementRef;

    public constructor(el: ElementRef) {
        this.isDestroyed = new Subject();
        this.el = el;
    }

    public ngOnInit() {

        const clickStream = fromEvent(this.el.nativeElement, "click");

        const debounceMouse$ = clickStream.pipe(
            debounceTime(this.delay),
            takeUntil(this.isDestroyed)
        );

        clickStream.pipe(
            buffer(debounceMouse$),
            filter(events => events.length >= 2),
            takeUntil(this.isDestroyed)
        )
        .subscribe((events: Event[]) => {
            this.dblClick.emit(events[0]);
        });
    }

    public ngOnDestroy() {
        this.isDestroyed.next(true);
    }
}
