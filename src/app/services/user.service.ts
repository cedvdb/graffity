import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, filter, shareReplay, tap, map } from 'rxjs/operators';
import { Col } from 'shared/collections';
import { User } from 'shared/collections';


@Injectable({ providedIn: 'root' })
export class UserService {

  userSync: User;
  user$ = this.auth.user.pipe(
    filter(user => !!user),
    switchMap(user => this.firestore.collection(Col.USER).doc<User>(user.uid).valueChanges()),
    tap(user => this.userSync = user),
    shareReplay(1)
  );

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}


  createUser(username: string) {
    return this.auth.user.pipe(
      switchMap(user => this.firestore.collection(Col.USER).doc(user.uid).set({
          uid: user.uid,
          username: username.substr(0, 24),
          image: user.photoURL || 'assets/icons/icon-72x72.png'
        })
      )
    );
  }

}
