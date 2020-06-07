import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { enc } from 'crypto-js';
import { decrypt } from 'crypto-js/aes';
import { Wallet as WalletWeb } from 'nanocurrency-web/dist/lib/address-importer';
import { filter, switchMap, tap, delay } from 'rxjs/operators';
import { Wallet } from 'shared/collections';
import { NanoService } from './nano/nano.service';
import { WalletService } from './wallet.service';

@Injectable({ providedIn: 'root' })
export class LegacyWalletService {
  legacyWalletDetected = false;
  legacyWallet: Wallet;
  private storageKey: string;

  constructor(
    private auth: AngularFireAuth,
    private nanoSrv: NanoService,
    private walletSrv: WalletService
  ) {

  }

  init() {
    this.auth.user.pipe(
      filter(user => !!user),
      tap(d => { debugger; })
     ).subscribe(user => this.checkLegacyWallet(user));
  }

  transferFundsToSynced() {
    const currentAddress = this.walletSrv.wallet.account.address;
    const legacyAddress = this.legacyWallet.account.address;
    return this.nanoSrv.getAccountInfo(legacyAddress).pipe(
      switchMap(accountInfo => this.nanoSrv.getPendingTransactions(this.legacyWallet, accountInfo)),
      switchMap(accountInfo => this.nanoSrv.send(
        currentAddress,
        accountInfo.balance,
        accountInfo,
        this.legacyWallet
        )
      ),
      delay(4000),
      switchMap(_ => this.walletSrv.refreshFunds())
    );

  }

  private checkLegacyWallet(user: firebase.User) {
    this.storageKey = this.getStorageKey(user.uid);
    const found = localStorage.getItem(this.storageKey);
    if (!found) {
      return this.legacyWalletDetected = false;
    }
    this.legacyWalletDetected = true;
    const bytes = decrypt(found, user.uid);
    const decryptedWallet = bytes.toString(enc.Utf8);
    const wltWeb: WalletWeb = JSON.parse(decryptedWallet);
    this.legacyWallet = {
      seed: wltWeb.seed,
      mnemonic: wltWeb.mnemonic,
      account: wltWeb.accounts[0]
    };
  }

  remove() {
    localStorage.removeItem(this.storageKey);
    this.legacyWallet = undefined;
    this.legacyWalletDetected = undefined;
  }

  private getStorageKey(uid: string) {
    return `nano-${uid}`;
  }
}
