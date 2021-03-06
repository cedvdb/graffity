import { Component, ElementRef, OnInit, Renderer2, TrackByFunction, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Message } from 'shared/collections';
import { log } from 'simply-logs';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { SendDialogComponent } from 'src/app/components/send-dialog/send-dialog.component';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';
import { UserService } from 'src/app/services/user.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ChatRouterService } from 'src/app/services/chat-router.service';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  providers: [
  ]
})
export class ChatPageComponent extends AutoUnsub implements OnInit {
  faPaperPlane = faPaperPlane;
  newMsgContent = '';
  messages$: Observable<Message[]> = this.messageSrv.messages$;
  user = this.userSrv.userSync;
  private keepBottomScrolled = true;
  @ViewChild('inp') textarea: ElementRef<HTMLTextAreaElement>;
  @ViewChild('msgCtnr') msgCtnr: ElementRef<HTMLElement>;

  trackBy: TrackByFunction<any> = (index, item) => item.id;

  constructor(
    private messageSrv: MessageService,
    private userSrv: UserService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    public walletSrv: WalletService,
    public geolocationSrv: GeolocationService,
    public presenceSrv: PresenceService,
    public chatRouterSrv: ChatRouterService
  ) { super(); }

  ngOnInit(): void {
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
    this.messageSrv.send(this.newMsgContent);
    this.newMsgContent = '';
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
    el.scrollTop = (el.scrollHeight);
  }

  onInputFocus() {
    this.scrollToBottom();
  }

  sendNano(address: string) {
    this.dialog.open(SendDialogComponent, { data: { address } });
  }

}
