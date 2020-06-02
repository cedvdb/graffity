import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { wallet } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Col } from 'shared/collections.enum';
import { encrypt, decrypt } from 'crypto-js/aes';
import { enc } from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class WalletService {
  wallet$ = new ReplaySubject<Wallet>(1);
  walletStatus$: BehaviorSubject<'pending' | 'success' | 'lost'> = new BehaviorSubject('pending');

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    // on auth get wallet
    this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.getWallet(user))
    ).subscribe();
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
      .doc<{ addresses: string[] }>(user.uid)
      .get()
      .pipe(switchMap(doc => this.createIfNotExist(doc.data(), user.uid)));
  }

  private createIfNotExist(addressDoc: any, uid: string) {
    const key = `nano-${uid}`;
    if (!addressDoc) {
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
        // TODO check if address is present in wallet
        this.wallet$.next(JSON.parse(decryptedWallet));
        this.walletStatus$.next('success');
      } else {
        this.walletStatus$.next('lost');
      }
      return Promise.resolve();
    }
  }

}
