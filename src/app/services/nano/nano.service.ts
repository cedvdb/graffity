import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { wallet } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { BehaviorSubject, ReplaySubject, concat, of, Observable } from 'rxjs';
import { filter, switchMap, map, tap, mergeMap, concatMap } from 'rxjs/operators';
import { Col, NanoAddressesDoc } from 'shared/collections';
import { encrypt, decrypt } from 'crypto-js/aes';
import { enc } from 'crypto-js';
import { block } from 'nanocurrency-web';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PendingResp, BlockInfoResp, BlockInfo, AccountInfo } from './nano.interfaces';

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
    private http: HttpClient
  ) {
    // on auth get wallet
    this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.getWallet(user))
    ).subscribe();

    // get account info when we have one
    this.wallet$.pipe(
      // switchMap(wlt => this.getAccountInfo(wlt), wlt => wlt),
      // switchMap()
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

  private getFunds(wlt: Wallet) {
    const address = this.getWalletAddr(wlt);
    const pendingBlocks$ = this.getAccountInfo(address).pipe(
      // we actually don't care about the call above
      switchMap(_ => this.http.post<PendingResp>(environment.nanoApi.url, { action: 'pending', account: address })),
      map(pending => pending.blocks),
      switchMap(hashes => this.http.post<BlockInfoResp>(environment.nanoApi.url,
        { action: 'block_info', json_block: true, hashes })),
    );

    return pendingBlocks$.pipe(
      map(blockInfos => Object.entries(blockInfos).map(([hash, blockInfo]) =>
      // before every block confirmation we reget the user info
        this.getAccountInfo(address).pipe(
          switchMap(accountInfo => this.sendReceiveBlock(address, accountInfo, blockInfo, hash))
        )
      )),
      switchMap(obsArr => concat(obsArr))
    );
  }

  private getAccountInfo(address: string) {
    return this.http.post<AccountInfo>(environment.nanoApi.url, { action: 'account_info', account: address }).pipe(
      tap(info => this.accountInfo$.next(info))
    );
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



  private sendReceiveBlock(address: string, accountInfo: AccountInfo, info: BlockInfo, transactionHash: string): Observable<any> {
    const data = {
      // Your current balance in RAW
      walletBalanceRaw: accountInfo.balance,
      // Your address
      toAddress: address,
      // From wallet info
      representativeAddress: info.contents.representative,
      // From wallet info
      frontier: accountInfo.frontier,
      // From the pending transaction
      transactionHash,
      // From the pending transaction in RAW
      amountRaw: info.amount,
      // work: this.pow
    };
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    // const signedBlock = block.receive(data, privateKey);
    return of();
  }

  private getWalletAddr(wlt: Wallet) {
    return wlt.accounts[0].address;
  }

}
