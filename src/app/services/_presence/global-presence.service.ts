import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, timer } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Col } from 'shared/collections';
import { log } from 'simply-logs';

@Injectable({ providedIn: 'root' })
export class GlobalPresenceService {
  onlineUsers$ = new BehaviorSubject<number>(1);
  private timeInterval = 5 * 60 * 1000;
  private presenceCollection = this.firestore.collection(Col.GLOBAL_PRESENCE,
    // the documents that have a date minus the time interval here + a min
    ref => ref.where('date', '>',  Date.now() - (this.timeInterval + 60 * 1000)));

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  init() {
    this.getOnlineUsers();
    this.pingLocation();
  }

  private getOnlineUsers() {
    this.presenceCollection.valueChanges().pipe(
      map(docs => docs.length)
    ).subscribe(users => this.onlineUsers$.next(users));
  }

  private pingLocation() {
    // when there is a connection
    const user$ = this.auth.user.pipe(
      filter(user => !!user)
    );

    user$.pipe(
      tap(d => log.debug('user global presence')),
      switchMap((user) => timer(0, this.timeInterval).pipe(
        switchMap(_ => this.presenceCollection.doc(user.uid).set({
          uid: user.uid,
          date: Date.now()
        }))
      )),
    ).subscribe();
  }
}
