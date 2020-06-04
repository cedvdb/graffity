

import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// utility class to unsub from observable
@Directive({})
// tslint:disable-next-line: directive-class-suffix
export abstract class AutoUnsub implements OnDestroy {

  protected destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
