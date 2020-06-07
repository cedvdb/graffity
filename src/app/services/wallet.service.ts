import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, filter, tap, shareReplay, take } from 'rxjs/operators';
import { Col, Wallet } from 'shared/collections';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { wallet as WalletWeb } from 'nanocurrency-web';
import functions from 'firebase/functions';

@Injectable({ providedIn: 'root' })
export class WalletService {
  walletSync: Wallet;
  wallet$ = this.userSrv.user$.pipe(
    filter(user => !!user),
    switchMap(user => this.firestore.collection(Col.NANO_WALLETS)
    .doc<Wallet>(user.uid).valueChanges()
    ),
    // in legacy app, user didn't have a wallet created for them
    tap(wlt => this.createIfNotExist(wlt)),
    tap(d => { debugger; }),
    filter(wlt => !!wlt),
    tap(d => { debugger; }),
    // end legacy
    tap((wallet: Wallet) => this.walletSync = wallet),
    take(1),
    shareReplay(1)
  );

  constructor(
    private firestore: AngularFirestore,
    private userSrv: UserService
  ) { }


  private createIfNotExist(wlt: Wallet) {
    if (!wlt) {
      functions().httpsCallable('addMessage');
    }
  }

  private getAppWallet(): Wallet {
    const wlt = WalletWeb.generate();
    return {
      seed: wlt.seed,
      mnemonic: wlt.mnemonic,
      account: wlt.accounts[0]
    };
  }

}
