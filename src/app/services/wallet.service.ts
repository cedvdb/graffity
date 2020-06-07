import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { enc } from 'crypto-js';
import { decrypt } from 'crypto-js/aes';
import { } from 'firebase/functions';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { EncryptedWallet, Wallet } from 'shared/collections';
import { tools } from 'nanocurrency-web';
import { AccountInfo } from './nano/nano.interfaces';
import { NanoService } from './nano/ref.nano.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private callable = this.fns.httpsCallable('getWallet');
  walletSync: Wallet;
  addressSync: string;
  wallet$: Observable<Wallet> = this.callable({}).pipe(
    map((encWlt: EncryptedWallet) => this.decryptWallet(encWlt)),
    tap(wlt => this.walletSync = wlt),
    tap(wlt => this.addressSync = wlt.account.address)
  );
  accountInfo$: Observable<AccountInfo> = this.wallet$.pipe(
    map(wlt => wlt.account.address),
    switchMap(address => this.nanoSrv.getAccountInfo(address))
  );

  constructor(
    private fns: AngularFireFunctions,
    private nanoSrv: NanoService,
    private snackBar: MatSnackBar
  ) { }

  init() {
    this.nanoSrv.fetchFunds().subscribe();
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

  send(toAddress = '', amountNano: any = '0') {
    const amountRaw = tools.convert(amountNano, 'NANO', 'RAW');
    const isSendOk = this.isSendOk(toAddress, amountRaw);

    if (!isSendOk) {
      return;
    }

  }

  private isSendOk(address: string, amountRaw: any) {
    if (!tools.validateAddress(address)) {
      this.snackBar.open('Invalid address', 'ok', { duration: 3000 });
      return false;
    }
    if (!Number(amountRaw) || amountRaw > this.nanoSrv.ac) {
      this.snackBar.open('Invalid amount', 'ok', { duration: 3000 });
      return false;
    }
    return true;
  }

}
