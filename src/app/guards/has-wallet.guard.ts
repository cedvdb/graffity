import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { WalletService } from '../services/wallet.service';

@Injectable({ providedIn: 'root' })
export class HasWallet implements CanActivate {

  constructor(
    private walletSrv: WalletService,
  ) {}

  canActivate() {
    return this.walletSrv.wallet$.pipe(
      map(wlt => !!wlt),
      // wait for creation before going through
      filter(hasOne => hasOne),
    );
  }

}
