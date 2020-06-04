import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col, Message } from 'shared/collections';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  newMsgContent = '';
  messages$: Observable<Message[]>;
  currentUser: Observable<firebase.User>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.user;
    this.messages$ = this.firestore.collection<Message>(Col.MESSAGES).valueChanges();
  }

  async postMessage() {
    if (! this.newMsgContent) {
      return;
    }
    const user = await this.currentUser.toPromise();
    const message = {
      content: this.newMsgContent,
      createdBy: {
        uid: user.uid,
        picture: user.photoURL,
        name: user.displayName
      }
    };
    this.newMsgContent = '';
    this.firestore.collection(Col.MESSAGES).add(message);
  }

}
