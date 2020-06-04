import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col, Message } from 'shared/collections';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent extends AutoUnsub implements OnInit {
  newMsgContent = '';
  messages$: Observable<Message[]>;
  user: firebase.User;
  @ViewChild('inp') textarea: ElementRef<HTMLTextAreaElement>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private renderer: Renderer2
  ) { super(); }

  ngOnInit(): void {
    this.auth.user.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
    this.messages$ = this.firestore.collection<Message>(Col.MESSAGES).valueChanges();
  }

  async postMessage(event: InputEvent) {
    event.preventDefault();
    if (! this.newMsgContent) {
      return;
    }
    const message = {
      content: this.newMsgContent,
      createdBy: {
        uid: this.user.uid,
        picture: this.user.photoURL,
        name: this.user.displayName
      }
    };
    this.newMsgContent = '';
    this.firestore.collection(Col.MESSAGES).add(message);
  }

  onInput() {
    const el = this.textarea.nativeElement;
    this.renderer.setStyle(el, 'height', el.scrollHeight + 'px');
  }

}
