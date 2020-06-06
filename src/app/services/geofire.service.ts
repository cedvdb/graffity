import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col } from 'shared/collections';
import { GeoFirestore } from 'geofirestore';


@Injectable({ providedIn: 'root' })
export class GeofireService {
  private geofirestore: GeoFirestore = new GeoFirestore(this.firestore.firestore);

  constructor(
    private firestore: AngularFirestore
  ) {

  }

  collection(col: Col) {
    return this.geofirestore.collection(col);
  }

}
