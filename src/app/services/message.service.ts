import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GeoFirestore } from 'geofirestore';
import { Col, Message } from 'shared/collections';
import * as firebase from 'firebase';
import { GeolocationService, Coordinates } from './geolocation.service';
import { switchMap, first, map } from 'rxjs/operators';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';


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
    const query = this.messagesCol.near({
      center: new firebase.firestore.GeoPoint(coords.lat, coords.long),
      radius: 50000
    });

    // get the messages for this coord
    query.get()
      .then(snap => snap.docs.map(doc => doc.data()))
      .then(messages => messages.sort((a, b) => a.createdAt - b.createdAt))
      .then(messages => this.messages = messages);

    // listen for changes
    query.onSnapshot(snap => {
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newMsg = change.doc.data();
            this.messages.push(newMsg);
            this.messagesSubj$.next(this.messages);
          }
      });
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
