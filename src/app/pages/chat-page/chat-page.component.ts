import { Component, ElementRef, OnInit, Renderer2, TrackByFunction, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Message } from 'shared/collections';
import { log } from 'simply-logs';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { MessageService } from 'src/app/services/message.service';
import { AddressService } from 'src/app/services/address.service';
import { SendDialogComponent } from 'src/app/components/send-dialog/send-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  providers: [
  ]
})
export class ChatPageComponent extends AutoUnsub implements OnInit {

  newMsgContent = '';
  messages$: Observable<Message[]> = this.messageSrv.messages$;
  user: firebase.User;
  private keepBottomScrolled = true;
  @ViewChild('inp') textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('msgCtnr') msgCtnr: ElementRef<HTMLElement>;

  trackBy: TrackByFunction<any> = (index, item) => item.id;

  constructor(
    private messageSrv: MessageService,
    private auth: AngularFireAuth,
    private renderer: Renderer2,
    private addressSrv: AddressService,
    private dialog: MatDialog
  ) { super(); }

  ngOnInit(): void {
    this.auth.user.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => this.user = user);
    // scroll to bottom when we first get msgs;
    this.messages$.pipe(
      delay(100),
      takeUntil(this.destroy$)
    ).subscribe(_ => {
      if (this.keepBottomScrolled) {
        this.scrollToBottom();
      }
    });
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

  onScroll() {
    const el = this.msgCtnr.nativeElement;
    // we check if we are at bottom minus 20 px to give a bit of marge
    const isBottom = el.scrollTop > (el.scrollHeight - el.offsetHeight) - 20;
    log.debug(el.scrollTop, (el.scrollHeight - el.offsetHeight));
    if (isBottom) {
      this.keepBottomScrolled = true;
    } else {
      this.keepBottomScrolled = false;
    }
  }

  scrollToBottom() {
    const el = this.msgCtnr.nativeElement;
    el.scrollTop = (el.scrollHeight - el.offsetHeight);
  }

  sendNano(uid: string) {
    this.addressSrv.getUserAddress(uid)
      .subscribe(address => this.dialog.open(SendDialogComponent, { data: { address } }));
  }

}
