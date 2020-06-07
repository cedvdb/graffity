import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concat, Observable, of } from 'rxjs';
import { map, mergeMap, retry, switchMap, tap } from 'rxjs/operators';
import { Wallet } from 'shared/collections';
import { log } from 'simply-logs';
import { BlockService } from './block.service';
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
      // retry(10)
    );
  }

  getPendingTransactions(wallet: Wallet, accountInfo: AccountInfo) {
    const address = wallet.account.address;

    return this.nanoRpc.getPendingHashes(address).pipe(
      mergeMap(hashes => this.processPending(hashes, wallet, accountInfo))
    );
  }

  private processPending(hashes: string[], wallet: Wallet, accountInfo: AccountInfo) {
    // if nothing to be done we just return account info and bypass all
    if (!hashes) {
      log.debug(`no pending transaction found`);
      return of(accountInfo);
    }
    this.snackBar.open(`Processing ${hashes.length} pending transactions, this will take a min`, 'ok', { duration: 120000 });
    return concat(...hashes).pipe(
      tap(hash => log.debug('processing transaction')),
      switchMap(hash => this.receiveBlock(wallet, hash, accountInfo)),
      tap(hash => log.debug('transaction received')),
    );
  }

  send(toAddress = '', amountRaw: any = '0', accountInfo: AccountInfo, wallet: Wallet) {
    log.debug(`sending ${amountRaw} to ${toAddress}`);
    return this.nanoRpc.getBlockInfo(accountInfo.representative_block).pipe(
      map(blockInfo => blockInfo.contents.representative),
      switchMap(representativeAddress => this.blockSrv.getSignedSendBlock(
        wallet,
        accountInfo,
        amountRaw,
        toAddress,
        representativeAddress
      )),
      switchMap(sendBlock => this.nanoRpc.process('send', sendBlock))
    );
  }

  private receiveBlock(wallet: Wallet, hash: string, accountInfo: AccountInfo) {
    return this.nanoRpc.getBlockInfo(hash).pipe(
      switchMap((blockInfo) => this.blockSrv.getSignedReceiveBlock(
        wallet,
        accountInfo,
        blockInfo,
        hash
        )
      ),
      switchMap(signedBlock => this.nanoRpc.process('receive', signedBlock)),
      switchMap(successResp => this.getAccountInfo(wallet.account.address)),
      tap(_ => this.snackBar.open('You just received nano, check your wallet', 'ok'))
    );
  }
}
