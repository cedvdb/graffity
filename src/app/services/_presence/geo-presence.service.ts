import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { combineLatest, interval, timer, BehaviorSubject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Col } from 'shared/collections';
import { log } from 'simply-logs';
import { GeofireService } from '../_messaging/geofire.service';
import { GeolocationService } from '../geolocation.service';


@Injectable({ providedIn: 'root' })
export class GeoPresenceService {
  onlineUsersAtLocation$ = new BehaviorSubject<number>(1);
  private presenceCol = this.geofireSrv.collection(Col.GEO_PRESENCE);
  private timeInterval = 5 * 60 * 1000;
  private onlineUsersAtLocation = 1;

  constructor(
    private auth: AngularFireAuth,
    private geofireSrv: GeofireService,
    private geolocationSrv: GeolocationService
  ) { }

  init() {
    this.getOnlineUsers();
    this.pingLocation();
  }

  private getOnlineUsers() {
    combineLatest([
      this.geolocationSrv.userCoordinates$,
      this.auth.user.pipe(filter(user => !!user))
    ]).subscribe(([coords, user]) => {
      this.onlineUsersAtLocation = 1;
      this.presenceCol
        .near({
          center: new firebase.firestore.GeoPoint(coords.lat, coords.long),
          radius: 100
        }).onSnapshot(snap => {
          snap.docChanges()
          .filter(change => change.doc.data().date > Date.now() - this.timeInterval)
          .filter(change => change.doc.data().uid !== user.uid)
          .forEach(change => {
            const data = change.doc.data();
            if (change.type === 'added') {
              this.onlineUsersAtLocation++;
            } else if (change.type === 'removed') {
              this.onlineUsersAtLocation--;
            }
            this.onlineUsersAtLocation$.next(this.onlineUsersAtLocation);
          });
          log.debug(`online users at location: ${this.onlineUsersAtLocation}`);
        });
    });
  }

  private pingLocation() {
    // when there is a connection
    const user$ = this.auth.user.pipe(
      filter(user => !!user)
    );
    // when user change location
    const coords$ = this.geolocationSrv.userCoordinates$;

    // when both happen we set an interval that changes the
    // time an user is there
    combineLatest([
      user$,
      coords$
    ]).pipe(
      tap(d => log.debug('user loc'), ),
      switchMap(([user, coords]) => timer(0, this.timeInterval).pipe(
        switchMap(_ => this.presenceCol.doc(user.uid).set({
          uid: user.uid,
          date: Date.now(),
          coordinates: new firebase.firestore.GeoPoint(coords.lat, coords.long),
        }))
      )),
    ).subscribe();
  }
}
