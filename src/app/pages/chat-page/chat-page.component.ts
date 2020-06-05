import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ElementRef, OnInit, Renderer2, TrackByFunction, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';
import { Message } from 'shared/collections';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  // providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CdkAutoSizeVirtualScroll }]
})
export class ChatPageComponent extends AutoUnsub implements OnInit {

  newMsgContent = '';
  messages$: Observable<Message[]> = this.messageSrv.messages$;
  user: firebase.User;
  @ViewChild('inp') textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild(CdkVirtualScrollViewport, { static: false, read: ElementRef }) scrollCtnr: ElementRef<HTMLElement>;
  trackBy: TrackByFunction<any> = (_, item) => item.id;

  constructor(
    private messageSrv: MessageService,
    private auth: AngularFireAuth,
    private renderer: Renderer2
  ) { super(); }

  ngOnInit(): void {
    this.auth.user.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
    // scroll to bottom when we first get msgs;
    this.messages$.pipe(
      delay(150),
      take(1)
    ).subscribe(_ => this.scrollToBottom());
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

  scrollToBottom() {
    this.scrollCtnr.nativeElement.scrollTop = this.scrollCtnr.nativeElement.scrollHeight;
  }

}
