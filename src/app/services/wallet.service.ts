// I think the wallets should be saved online to make it easy for new commers, but I also
// think that ain't gonna fly with the nano community so not doing it


// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore/firestore';
// import { Col } from 'shared/collections';
// import { AngularFireAuth } from '@angular/fire/auth/auth';
// import { filter, map, switchMap, tap } from 'rxjs/operators';
// import { Observable, ReplaySubject } from 'rxjs';
// import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';


// @Injectable({ providedIn: 'root' })
// export class WalletService {

//   private walletSubj$ = new ReplaySubject<Wallet>(1);
//   wallet$: Observable<Wallet>;

//   constructor(
//     private firestore: AngularFirestore,
//     private auth: AngularFireAuth
//   ) {}

//   init() {
//     this.auth.user.pipe(
//       filter(user => !!user),
//       map(user => user.uid),
//       switchMap(uid => this.firestore.collection(Col.NANO_WALLETS).doc<Wallet>(uid).valueChanges()),
//       tap(d => { debugger; }),
//     ).subscribe((wallet) => this.walletSubj$.next(wallet));
//   }

//   private createIfNotExist() {

//   }
// }
