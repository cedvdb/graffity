import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { enc } from 'crypto-js';
import { decrypt } from 'crypto-js/aes';
import { Wallet as WalletWeb } from 'nanocurrency-web/dist/lib/address-importer';
import { of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Wallet } from 'shared/collections';
import { AccountInfo } from './nano/nano.interfaces';
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
    ).subscribe(user => this.checkLegacyWallet(user));
  }

  transferFundsToSynced() {
    const legacyAddress = this.legacyWallet.account.address;
    return this.nanoSrv.getAccountInfo(legacyAddress).pipe(
      switchMap(accountInfo => this.nanoSrv
          .getPendingTransactions(this.legacyWallet, accountInfo)),
      switchMap(accountInfo => this.sendIfNeeded(accountInfo)),
      switchMap(_ => this.walletSrv.refreshFunds()),
      tap(_ => this.destroy())
    );
  }

  private sendIfNeeded(accountInfo: AccountInfo) {
    if (Number(accountInfo.balance) > 0) {
      return this.nanoSrv.send(
        this.walletSrv.address,
        accountInfo.balance,
        accountInfo,
        this.legacyWallet
      );
    } else {
      return of(false);
    }
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

  destroy() {
    localStorage.removeItem(this.storageKey);
    this.legacyWallet = undefined;
    this.legacyWalletDetected = undefined;
  }

  private getStorageKey(uid: string) {
    return `nano-${uid}`;
  }
}
