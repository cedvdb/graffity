import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GeoFirestore } from 'geofirestore';
import { combineLatest, ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Col, Message } from 'shared/collections';
import { Coordinates, GeolocationService } from './geolocation.service';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class MessageService {
  geofirestore: GeoFirestore = new GeoFirestore(this.firestore.firestore);
  messagesCol = this.geofirestore.collection(Col.MESSAGES);
  private messages = [];
  private messagesSubj$ = new ReplaySubject<Message[]>(1);
  messages$ = this.messagesSubj$.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private geolocationSrv: GeolocationService,
  ) {

  }

  init() {
    this.geolocationSrv.userCoordinates$.subscribe(coords => this.getMessages(coords));
  }

  private async getMessages(coords: Coordinates) {
    console.log('getting messages for', JSON.stringify(coords));
    const query = this.messagesCol.near({
      center: new firebase.firestore.GeoPoint(coords.lat, coords.long),
      radius: 100
    });

    // listen for changes
    query.onSnapshot(snap => {
      const messages = snap.docChanges()
        .filter(change => change.type === 'added')
        .map((change) => change.doc.data())
        .sort((a, b) => a.createdAt - b.createdAt);
      this.messages.push(...messages);
      this.messagesSubj$.next(this.messages);
    });

  }

  send(content: string) {
    return combineLatest([
      this.geolocationSrv.userCoordinates$,
      this.auth.user
    ]).pipe(
      map(([coords, user]) => ({
        content,
        createdBy: {
          uid: user.uid,
          picture: user.photoURL,
          name: user.displayName
        },
        coordinates: new firebase.firestore.GeoPoint(coords.lat, coords.long),
        createdAt: Date.now()
      })),
      switchMap(message => this.messagesCol.add(message))
    ).pipe(first());
  }

}
