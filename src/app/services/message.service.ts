import { Injectable } from '@angular/core';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ChatRoute, ChatRouterService } from './chat-router.service';
import { GeoMessageService } from './_messaging/geo-message.service';
import { GlobalMessageService } from './_messaging/global-message.service';

@Injectable({ providedIn: 'root' })
export class MessageService {

  messages$ = this.chatRoutingSrv.route$.pipe(
    distinctUntilChanged(),
    switchMap(route => this.getMessagesForRoute(route))
  );

  constructor(
    private chatRoutingSrv: ChatRouterService,
    private geoMsgSrv: GeoMessageService,
    private globalMsgSrv: GlobalMessageService
  ) {}

  init() {
    this.globalMsgSrv.init();
    this.geoMsgSrv.init();
  }

  private getMessagesForRoute(route: ChatRoute) {
    if (this.chatRoutingSrv.isGlobal) {
      return this.globalMsgSrv.messages$;
    } else {
      return this.geoMsgSrv.messages$;
    }
  }

  send(content: string) {
    if (this.chatRoutingSrv.isGlobal) {
      return this.globalMsgSrv.send(content);
    } else {
      return this.geoMsgSrv.send(content);
    }
  }

}
