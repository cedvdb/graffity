import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { combineLatest, ReplaySubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Col, Message } from 'shared/collections';
import { log } from 'simply-logs';
import { GeofireService } from './geofire.service';
import { Coordinates, GeolocationService } from './geolocation.service';
import { NanoService } from './nano/nano.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messagesCol = this.geofireSrv.collection(Col.MESSAGES);
  private messages = [];
  private messagesSubj$ = new ReplaySubject<Message[]>(1);
  messages$ = this.messagesSubj$.asObservable().pipe();
  private currentUnsub: any;
  private maxAmount = 30;

  constructor(
    private geofireSrv: GeofireService,
    private geolocationSrv: GeolocationService,
    private nanoSrv: NanoService,
    private userSrv: UserService
  ) {

  }

  init() {
    this.geolocationSrv.userCoordinates$.subscribe(coords => this.getMessages(coords));
  }

  private async getMessages(coords: Coordinates) {
    log.info('getting messages for', JSON.stringify(coords));
    this.messages = [];
    if (this.currentUnsub) {
      this.currentUnsub();
    }
    const query = this.messagesCol.near({
      center: new firebase.firestore.GeoPoint(coords.lat, coords.long),
      radius: 100
    });

    // listen for changes
    this.currentUnsub = query.onSnapshot(snap => {
      log.debug('new snapshot');
      const messages = snap.docChanges()
        .filter(change => change.type === 'added')
        .map((change) => change.doc.data())
        .sort((a, b) => a.createdAt - b.createdAt);
      const fromIndex = messages.length > this.maxAmount ? messages.length - this.maxAmount : 0;
      this.messages = [...this.messages, ...messages].slice(fromIndex);
      this.messagesSubj$.next(this.messages);
    });

  }

  send(content: string) {
    return combineLatest([
      this.geolocationSrv.userCoordinates$,
      this.userSrv.user$,
    ]).pipe(
      map(([coords, user]) => ({
        content,
        createdBy: {
          uid: user.uid,
          image: user.image,
          username: user.username,
          nanoAddress: this.nanoSrv.getAddressSync() || ''
        },
        coordinates: new firebase.firestore.GeoPoint(coords.lat, coords.long),
        createdAt: Date.now()
      } as Message)),
      switchMap(message => this.messagesCol.add(message))
    ).pipe(first());
  }

}
