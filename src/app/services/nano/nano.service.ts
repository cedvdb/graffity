import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { wallet } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
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
  balance$ = new ReplaySubject<number>(1);

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

    this.wallet$.subscribe(wlt => this.getAccountInfo(wlt.accounts[0].address));
  }

  private getWallet(user: firebase.User) {

    // check DB if user has address
    // if NO create wallet
    //   save wallet in local storage
    //   set (public) address in DB
    // if YES check local storage for wallet
    //   if no set as lost
    //   if yes return wallet
    return this.firestore.collection(Col.NANO_ADDRESSES)
      .doc<NanoAddressesDoc>(user.uid)
      .get()
      .pipe(switchMap((doc) => this.createIfNotExist(doc.data() as NanoAddressesDoc, user.uid)));
  }

  private getAddressInfo(address: string) {

  }

  private createIfNotExist(addressesDoc: NanoAddressesDoc, uid: string) {
    const key = `nano-${uid}`;
    if (!addressesDoc) {
      const wlt = wallet.generate();
      const address = wlt.accounts[0].address;
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
        const found = addressesDoc.addresses.find(addr => addr === wlt.accounts[0].address);
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

  private getPendingFunds(wlt: Wallet) {
    return this.http.post<PendingResp>(environment.nanoApi.url, { action: 'pending', account: address }).pipe(
      map(pending => pending.blocks),
      switchMap(hashes => this.http.post<BlockInfoResp>(environment.nanoApi.url, { action: 'block_info', json_block: true, hashes})),
      // map(pendingInfos => pendingInfos.)
    );
  }

  receive(address: string, info: BlockInfo, transactionHash: string) {
    const data = {
      // Your current balance in RAW
      walletBalanceRaw: '0',
      // Your address
      toAddress: address,
      // From wallet info
      representativeAddress: info.contents.representative,
      // From wallet info
      frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
      // From the pending transaction
      transactionHash,
      // From the pending transaction in RAW
      amountRaw: info.amount,
      // Generate the work server-side or with a DPOW service
      // work: this.pow
    };
    const privateKey = this.wallet.accounts[0].privateKey;
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    // const signedBlock = block.receive(data, privateKey);
  }

}
