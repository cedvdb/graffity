import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { } from 'firebase/functions';
import { Observable } from 'rxjs';
import { Wallet } from 'shared/collections';

@Injectable({ providedIn: 'root' })
export class WalletService {
  walletSync: Wallet;
  wallet$: Observable<Wallet> = this.fns.httpsCallable('getWallet')({});
  // wallet$ = this.userSrv.user$.pipe(
  //   filter(user => !!user),
  //   switchMap(user => this.firestore.collection(Col.NANO_WALLETS)
  //   .doc<Wallet>(user.uid).valueChanges()
  //   ),
  //   // in legacy app, user didn't have a wallet created for them
  //   tap(wlt => this.createIfNotExist(wlt)),
  //   filter(wlt => !!wlt),
  //   // end legacy
  //   tap((wallet: Wallet) => this.walletSync = wallet),
  //   take(1),
  //   shareReplay(1)
  // );

  constructor(
    private fns: AngularFireFunctions,
  ) { }


  private createIfNotExist(wlt: Wallet) {
    if (!wlt) {
      this.fns.httpsCallable('createWalletIfNotExist');
    }
  }

}
