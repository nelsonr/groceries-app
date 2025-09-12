import { Directive, HostListener, output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[debounceInput]'
})
export class Debounce {
  private readonly _value$ = new Subject<string>();
  private readonly _destroy$ = new Subject<void>();

  public debouncedInput = output<string>()

  constructor() {
    this._value$
      .pipe(
        takeUntil(this._destroy$),
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe((value) => {
        this.debouncedInput.emit(value);
      })
  }

  @HostListener("input", ["$event"])
  onInput(ev: Event) {
    const target = ev.target as HTMLInputElement;
    this._value$.next(target.value)
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
