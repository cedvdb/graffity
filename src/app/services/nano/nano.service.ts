import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { enc } from 'crypto-js';
import { decrypt, encrypt } from 'crypto-js/aes';
import { tools, wallet } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, concatAll, distinctUntilKeyChanged, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Col, NanoAddressesDoc } from 'shared/collections';
import { BlockService } from './block.service';
import { Helper } from './helper.utils';
import { NanoRpcService } from './nano-rpc.service';
import { AccountInfo } from './nano.interfaces';

@Injectable({ providedIn: 'root' })
export class NanoService {
  private wallet: Wallet;
  private walletSubj$ = new ReplaySubject<Wallet>(1);
  wallet$ = this.walletSubj$.asObservable().pipe(
    distinctUntilKeyChanged('seed')
  );
  walletStatus$ = new BehaviorSubject<'pending' | 'success' | 'lost'> ('pending');
  private accountInfo: AccountInfo;
  private accountInfo$ = new ReplaySubject<AccountInfo>(1);
  balance$ = this.accountInfo$.asObservable().pipe(
    map(info => info?.balance),
    map(balance => balance || '0'),
    map(raw => tools.convert(raw, 'RAW', 'NANO'))
  );

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private nanoRpc: NanoRpcService,
    private blockSrv: BlockService,
    private snackBar: MatSnackBar
  ) {
    // on auth get wallet
    this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.getWallet(user))
    ).subscribe();

    // get account info when we have one
    this.walletSubj$.pipe(
      tap(wlt => this.wallet = wlt),
      switchMap(wlt => this.getAccountInfo(wlt)),
    ).subscribe(info => this.accountInfo = info);

    // on account info fetch funds
    this.accountInfo$.pipe(
      first(),
      switchMap(_ => this.fetchFunds()),
      catchError(e => of(this.snackBar.open('There was an error retrieving your funds', 'ok', { duration: 3000 })))
    ).subscribe();
  }

  fetchFunds() {
    if (!this.wallet) {
      return;
    }
    const address = Helper.getWalletAddr(this.wallet);

    return this.nanoRpc.getPendingHashes(address).pipe(
      filter(x => !!x),
      tap(_ => this.snackBar.open('Processing pending transactions, this will take a min', 'ok', { duration: 120000 })),
      map(hashes => hashes.map(hash => this.receiveBlock(this.wallet, hash))),
      concatAll(),
      concatAll()
    );
  }

  send(toAddress = '', amountNano: any = '0') {
    const amountRaw = tools.convert(amountNano, 'NANO', 'RAW');
    const isSendOk = this.isSendOk(toAddress, amountRaw);

    if (!isSendOk) {
      return;
    }

    return this.getRepresentativeAddress(this.accountInfo).pipe(
      switchMap(representativeAddress => this.blockSrv.getSignedSendBlock(
        this.wallet,
        this.accountInfo,
        amountRaw,
        toAddress,
        representativeAddress
      )),
      switchMap(sendBlock => this.nanoRpc.process('send', sendBlock))
    );
  }

  async recover(mnemonic: string) {
    const wlt = wallet.fromMnemonic(mnemonic);
    const user = await this.auth.user.pipe(first()).toPromise();
    const addressesDocRef = await this.firestore.collection(Col.NANO_ADDRESSES)
    .doc(user.uid)
    .get()
    .pipe(first())
    .toPromise();
    const addressDoc = addressesDocRef.data();
    const ok = this.checkWallet(wlt, addressDoc.address);
    if (ok) {
      const encryptedWallet = encrypt(JSON.stringify(wlt), user.uid).toString();
      const key = this.getStorageKey(user.uid);
      localStorage.setItem(key, encryptedWallet);
    }
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
    const key = this.getStorageKey(uid);
    if (!addressesDoc) {
      const wlt = wallet.generate();
      const address = Helper.getWalletAddr(wlt);
      const encryptedWallet = encrypt(JSON.stringify(wlt), uid).toString();
      localStorage.setItem(key, encryptedWallet);
      return this.firestore.collection(Col.NANO_ADDRESSES).doc(uid)
      .set({ address })
      .then(_ => this.walletSubj$.next(wlt))
      .then(_ => this.walletStatus$.next('success'));
    } else {
      const encryptedWallet = localStorage.getItem(key);
      if (encryptedWallet) {
        const bytes = decrypt(encryptedWallet, uid);
        const decryptedWallet = bytes.toString(enc.Utf8);
        const wlt = JSON.parse(decryptedWallet);
        this.checkWallet(wlt, addressesDoc.address);
      } else {
        this.walletStatus$.next('lost');
      }
      return Promise.resolve();
    }
  }

  private checkWallet(wlt: Wallet, dbAddress: string) {
    const found = dbAddress === Helper.getWalletAddr(wlt);
    if (found) {
      this.walletSubj$.next(wlt);
      this.walletStatus$.next('success');
      return true;
    } else {
      this.snackBar.open('Not the wallet tied to your account', 'ok', { duration: 3000 });
      this.walletStatus$.next('lost');
      return false;
    }
  }

  private getStorageKey(uid: string) {
    return `nano-${uid}`;
  }

  private receiveBlock(wlt: Wallet, hash: string) {
    return this.nanoRpc.getBlockInfo(hash).pipe(
      switchMap((blockInfo) => this.blockSrv.getSignedReceiveBlock(wlt, this.accountInfo, blockInfo, hash)),
      switchMap(signedBlock => this.nanoRpc.process('receive', signedBlock)),
      switchMap(successResp => this.getAccountInfo(wlt)),
      tap(_ => this.snackBar.open('You just received nano, check your wallet', 'ok'))
    );
  }


  private isSendOk(address: string, amountRaw: any) {
    if (!tools.validateAddress(address)) {
      this.snackBar.open('Invalid address', 'ok', { duration: 3000 });
      return false;
    }
    if (!Number(amountRaw) || amountRaw > this.accountInfo.balance) {
      this.snackBar.open('Invalid amount', 'ok', { duration: 3000 });
      return false;
    }
    return true;
  }

  private getAccountInfo(wlt: Wallet): Observable<AccountInfo> {
    return this.nanoRpc.getAccountInfo(Helper.getWalletAddr(wlt)).pipe(
      tap(info => this.accountInfo$.next(info))
    );
  }

  private getRepresentativeAddress(accountInfo: AccountInfo): Observable<string> {
    return this.nanoRpc.getBlockInfo(accountInfo.representative_block).pipe(map(info => info.contents.representative));
  }

  getAddressSync() {
    return Helper.getWalletAddr(this.wallet);
  }


}
