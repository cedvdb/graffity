import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { enc } from 'crypto-js';
import { decrypt, encrypt } from 'crypto-js/aes';
import { tools, wallet } from 'nanocurrency-web';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, concatAll, distinctUntilKeyChanged, filter, first, map, switchMap, tap, retry } from 'rxjs/operators';
import { Col, NanoAddressesDoc, Wallet } from 'shared/collections';
import { BlockService } from './block.service';
import { Helper } from './helper.utils';
import { NanoRpcService } from './nano-rpc.service';
import { AccountInfo } from './nano.interfaces';

@Injectable({ providedIn: 'root' })
export class NanoService {

  constructor(
    private nanoRpc: NanoRpcService,
    private blockSrv: BlockService,
    private snackBar: MatSnackBar
  ) {}

  getAccountInfo(address: string): Observable<AccountInfo> {
    return this.nanoRpc.getAccountInfo(address).pipe(
      retry(10)
    );
  }

  fetchFunds(wallet: Wallet) {
    const address = wallet.account.address;

    return this.nanoRpc.getPendingHashes(address).pipe(
      filter(x => !!x),
      tap(_ => this.snackBar.open('Processing pending transactions, this will take a min', 'ok', { duration: 120000 })),
      map(hashes => hashes.map(hash => this.receiveBlock(wallet, hash))),
      concatAll(),
      concatAll()
    );
  }

  private receiveBlock(wlt: Wallet, hash: string) {
    return this.nanoRpc.getBlockInfo(hash).pipe(
      switchMap((blockInfo) => this.blockSrv.getSignedReceiveBlock(wlt, this.accountInfo, blockInfo, hash)),
      switchMap(signedBlock => this.nanoRpc.process('receive', signedBlock)),
      switchMap(successResp => this.getAccountInfo(wlt)),
      tap(_ => this.snackBar.open('You just received nano, check your wallet', 'ok'))
    );
  }
}
