import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col } from 'shared/collections';
import { map, first, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private firestore: AngularFirestore) {}

  getUserAddress(uid: string) {
    return this.firestore.collection(Col.NANO_ADDRESSES)
    .doc(uid)
    .get()
    .pipe(
      first(),
      map(doc => doc.data()),
      map(data => data.addresses[0])
    );
  }
}
