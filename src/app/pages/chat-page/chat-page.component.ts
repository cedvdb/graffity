import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Col, Message } from 'shared/collections';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { takeUntil } from 'rxjs/operators';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';
import { MessageService } from 'src/app/services/message.service';



@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent extends AutoUnsub implements OnInit {
  newMsgContent = '';
  messages$: Observable<Message[]> = this.messageSrv.messages$;
  user: firebase.User;
  @ViewChild('inp') textarea: ElementRef<HTMLTextAreaElement>;

  constructor(
    private messageSrv: MessageService,
    private auth: AngularFireAuth,
    private renderer: Renderer2
  ) { super(); }

  ngOnInit(): void {
    this.auth.user.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
  }

  async postMessage(event: InputEvent) {
    event.preventDefault();
    if (! this.newMsgContent) {
      return;
    }

    this.messageSrv.send(this.newMsgContent)
      .subscribe(_ => this.newMsgContent = '');
  }

  onInput() {
    const el = this.textarea.nativeElement;
    this.renderer.setStyle(el, 'height', el.scrollHeight + 'px');
  }

}
