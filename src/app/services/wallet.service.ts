import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { enc } from 'crypto-js';
import { decrypt } from 'crypto-js/aes';
import { } from 'firebase/functions';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap, switchMap, filter, first } from 'rxjs/operators';
import { EncryptedWallet, Wallet } from 'shared/collections';
import { tools } from 'nanocurrency-web';
import { AccountInfo } from './nano/nano.interfaces';
import { NanoService } from './nano/ref.nano.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private callable = this.fns.httpsCallable('getWallet');
  wallet: Wallet;
  address: string;
  balance = '0';
  wallet$: Observable<Wallet> = this.callable({}).pipe(
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
    const accountInfo$ = this.wallet$.pipe(
      map(wlt => wlt.account.address),
      switchMap(address => this.nanoSrv.getAccountInfo(address)),
    );
    // when wallet account info set the balance to nano
    accountInfo$.pipe(
      // no account info when wallet just created
      filter(accountInfo => !!accountInfo),
    ).subscribe(accountInfo => this.onAccountInfo(accountInfo));

    // when wallet first account info fetch pending transactions
    accountInfo$.pipe(
      first(),
      switchMap(accountInfo => this.nanoSrv.getPendingTransactions(this.wallet, accountInfo))
    ).subscribe(accountInfo => this.onAccountInfo(accountInfo));
  }

  refreshFunds() {
    this.nanoSrv.getPendingTransactions(this.wallet, this.accountInfo).subscribe();
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
    ).pipe();

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
  }

}
