import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col } from 'shared/collections';
import { map, first, tap, filter } from 'rxjs/operators';
import { NanoService } from './nano/nano.service';
import { Helper } from './nano/helper.utils';


@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(
    private firestore: AngularFirestore,
    private nanoSrv: NanoService
  ) {}

  getCurrentUserAddress() {
    return this.nanoSrv.wallet$.pipe(
      tap(d => { debugger; }),
      map(wlt => Helper.getWalletAddr(wlt)),
      filter(addr => !!addr)
    );
  }

  getAddress(uid: string) {
    return this.firestore.collection(Col.NANO_ADDRESSES)
    .doc(uid)
    .get()
    .pipe(
      first(),
      map(doc => doc.data()),
      map(data => data.address)
    );
  }
}
