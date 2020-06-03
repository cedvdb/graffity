import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { enc } from 'crypto-js';
import { decrypt, encrypt } from 'crypto-js/aes';
import { block, wallet } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { concatAll, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Col, NanoAddressesDoc } from 'shared/collections';
import { NanoRpcService } from './nano-rpc.service';
import { AccountInfo, BlockInfo } from './nano.interfaces';

@Injectable({ providedIn: 'root' })
export class NanoService {

  wallet$ = new ReplaySubject<Wallet>(1);
  walletStatus$ = new BehaviorSubject<'pending' | 'success' | 'lost'> ('pending');
  private accountInfo$ = new ReplaySubject<AccountInfo>(1);
  balance$ = this.accountInfo$.asObservable().pipe(map(info => info.balance));
  //  TODO add token

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private nanoRpc: NanoRpcService
  ) {
    // on auth get wallet
    this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.getWallet(user))
    ).subscribe();

    // get account info when we have one
    this.wallet$.pipe(
      switchMap(wlt => this.nanoRpc.getAccountInfo(this.getWalletAddr(wlt))),
    ).subscribe(info => this.accountInfo$.next(info));
    this.accountInfo$.pipe(
      first(),
      switchMap(_ => this.wallet$),
      switchMap(wlt => this.fetchFunds(wlt))
    ).subscribe();
  }

  private getWallet(user: firebase.User) {

    // check DB if user has a public address
    // if NO create wallet
    //   save wallet in local storage
    //   set (public) address in DB so we can send to user a well earned fatass check $$$$
    // if YES check local storage for wallet
    //   if no set as lost
    //   if yes return wallet
    return this.firestore.collection(Col.NANO_ADDRESSES)
      .doc<NanoAddressesDoc>(user.uid)
      .get()
      .pipe(switchMap((doc) => this.createIfNotExist(doc.data() as NanoAddressesDoc, user.uid)));
  }

  private createIfNotExist(addressesDoc: NanoAddressesDoc, uid: string) {
    const key = `nano-${uid}`;
    if (!addressesDoc) {
      const wlt = wallet.generate();
      const address = this.getWalletAddr(wlt);
      const encryptedWallet = encrypt(JSON.stringify(wlt), uid).toString();
      localStorage.setItem(key, encryptedWallet);
      return this.firestore.collection(Col.NANO_ADDRESSES).doc(uid)
      .set({ addresses: [address] })
      .then(_ => this.wallet$.next(wlt))
      .then(_ => this.walletStatus$.next('success'));
    } else {
      const encryptedWallet = localStorage.getItem(key);
      if (encryptedWallet) {
        const bytes = decrypt(encryptedWallet, uid);
        const decryptedWallet = bytes.toString(enc.Utf8);
        const wlt = JSON.parse(decryptedWallet);
        const found = addressesDoc.addresses.find(addr => addr === this.getWalletAddr(wlt));
        if (found) {
          this.wallet$.next(wlt);
          this.walletStatus$.next('success');
        } else {
          this.walletStatus$.next('lost');
        }
      } else {
        this.walletStatus$.next('lost');
      }
      return Promise.resolve();
    }
  }

  private fetchFunds(wlt: Wallet) {
    const address = this.getWalletAddr(wlt);
    const rpc = this.nanoRpc;

    return rpc.getPendingHashes(address).pipe(
      map(hashes => hashes.map(hash => this.receiveBlock(wlt, hash))),
      concatAll(),
      concatAll()
    );
  }

  private receiveBlock(wlt: Wallet, hash: string) {
    const address = this.getWalletAddr(wlt);
    return combineLatest([
      this.accountInfo$,
      this.nanoRpc.getBlockInfo(hash)
    ]).pipe(
      switchMap(([accountInfo, blockInfo]) => this.getSignedBlock(wlt, accountInfo, blockInfo, hash)),
      switchMap(signedBlock => this.nanoRpc.process('receive', signedBlock)),
      tap(d => { debugger; }),
      switchMap(successResp => this.nanoRpc.getAccountInfo(address))
    );
  }



  private async getSignedBlock(wlt: Wallet, accountInfo: AccountInfo, info: BlockInfo, transactionHash: string) {
    const worker = new Worker('./nano.worker', { type: 'module' });
    const hashToCompute = accountInfo.frontier || wlt.accounts[0].publicKey;
    debugger;
    const work: string = await new Promise(resolve => {
      worker.postMessage(hashToCompute);
      worker.onmessage = ev => {
        resolve(ev.data);
        worker.terminate();
      };
    });
    const data = {
      // Your current balance in RAW
      walletBalanceRaw: accountInfo.balance || '0',
      // Your address
      toAddress: this.getWalletAddr(wlt),
      // From wallet info
      representativeAddress: info.contents.representative,
      // From wallet info
      frontier: accountInfo.frontier ||
      '0000000000000000000000000000000000000000000000000000000000000000',
      // From the pending transaction
      transactionHash,
      // From the pending transaction in RAW
      amountRaw: info.amount,
      work
    };
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    return block.receive(data, wlt.accounts[0].privateKey);
  }

  private getWalletAddr(wlt: Wallet) {
    return wlt.accounts[0].address;
  }

}
