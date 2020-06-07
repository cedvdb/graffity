import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { filter, map, debounceTime, tap } from 'rxjs/operators';
import { WalletService } from '../services/wallet.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HasWalletGuard implements CanActivate {

  private loading$ = new Subject<boolean>();
  public loading = false;

  constructor(
    private walletSrv: WalletService,
  ) {
    this.loading$.pipe(debounceTime(300))
    .subscribe(loading => this.loading = loading);
  }

  canActivate() {
    this.loading$.next(true);
    return this.walletSrv.wallet$.pipe(
      map(wlt => !!wlt),
      tap(_ => this.loading$.next(false)),
      // wait for creation before going through
      filter(hasOne => hasOne)
    );
  }

}
