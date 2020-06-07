import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { concatAll, filter, map, retry, switchMap, tap } from 'rxjs/operators';
import { Wallet } from 'shared/collections';
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
      retry(10)
    );
  }

  getPendingTransactions(wallet: Wallet, accountInfo: AccountInfo) {
    const address = wallet.account.address;

    return this.nanoRpc.getPendingHashes(address).pipe(
      filter(x => !!x),
      tap(_ => this.snackBar.open('Processing pending transactions, this will take a min', 'ok', { duration: 120000 })),
      map(hashes => hashes.map(hash => this.receiveBlock(wallet, hash, accountInfo))),
      concatAll(),
      concatAll(),
      retry(10)
    );
  }

  send(toAddress = '', amountRaw: any = '0', accountInfo: AccountInfo, wallet: Wallet) {
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
