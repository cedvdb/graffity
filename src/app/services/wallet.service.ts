import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { enc } from 'crypto-js';
import { decrypt } from 'crypto-js/aes';
import { } from 'firebase/functions';
import { tools } from 'nanocurrency-web';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { AccountInfo } from './_nano/nano.interfaces';
import { NanoService } from './_nano/nano.service';
import { Wallet, EncryptedWallet } from 'shared/collections';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private callable = this.fns.httpsCallable('getWallet');
  wallet: Wallet;
  address: string;
  balance = '0';
  wallet$: Observable<Wallet> = this.callable({}).pipe(
    distinctUntilKeyChanged('uid'),
    map((encWlt: EncryptedWallet) => this.decryptWallet(encWlt)),
    tap(wlt => this.wallet = wlt),
    tap(wlt => this.address = wlt.account.address)
  );

  private accountInfo: AccountInfo;

  constructor(
    private fns: AngularFireFunctions,
    private nanoSrv: NanoService,
    private snackBar: MatSnackBar
  ) { }

  init() {
    // get account info for address
    this.wallet$.pipe(
      map(wlt => wlt.account.address),
      switchMap(address => this.nanoSrv.getAccountInfo(address)),
      tap(accountInfo => this.onAccountInfo(accountInfo)),
      // no account info when wallet just created
      filter(accountInfo => !!accountInfo),
      switchMap(accountInfo => this.nanoSrv.getPendingTransactions(this.wallet, accountInfo))
    ).subscribe(accountInfo => this.onAccountInfo(accountInfo));
    // when wallet account info set the balance to nano
  }

  refreshFunds() {
    return this.nanoSrv.getPendingTransactions(this.wallet, this.accountInfo);
  }

  send(toAddress = '', amountNano: any = '0') {
    const isSendOk = this.isSendOk(toAddress, amountNano);
    if (!isSendOk) {
      return;
    }
    const amountRaw = tools.convert(amountNano, 'NANO', 'RAW');

    return this.nanoSrv.send(
      toAddress,
      amountRaw,
      this.accountInfo,
      this.wallet
    ).pipe(
      tap(accountInfo => this.onAccountInfo(accountInfo))
    );

  }

  private decryptWallet(encWlt: EncryptedWallet): Wallet {
    if (encWlt.isDefaultPw) {
      const bytes = decrypt(encWlt.encrypted, 'NanoRocks');
      const decryptedWallet = bytes.toString(enc.Utf8);
      return JSON.parse(decryptedWallet);
    } else {
      throw Error('password wallet authentication not implemented yet');
    }
  }

  private isSendOk(address: string, amountNano: any) {
    if (!this.accountInfo) {
      this.snackBar.open('Failed, please make sure you have the fund', 'ok', { duration: 3000 });
    }
    if (!tools.validateAddress(address)) {
      this.snackBar.open('Invalid address', 'ok', { duration: 3000 });
      return false;
    }
    if (!Number(amountNano) || amountNano > this.balance) {
      this.snackBar.open('Invalid amount', 'ok', { duration: 3000 });
      return false;
    }
    return true;
  }

  private onAccountInfo(accountInfo: AccountInfo) {
    this.accountInfo = accountInfo;
    this.balance = tools.convert(accountInfo?.balance || '0' , 'RAW', 'NANO');
  }

}
