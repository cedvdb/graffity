import { Injectable } from '@angular/core';
import { GlobalPresenceService } from './_presence/global-presence.service';
import { GeoPresenceService } from './_presence/geo-presence.service';
import { ChatRouterService, ChatRoute } from './chat-router.service';
import { switchMap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class PresenceService {

  onlineUsers$ = this.chatRouter.route$.pipe(
    switchMap(_ => this.getOnlineUsersForRoute())
  );

  constructor(
    private globalPresenceSrv: GlobalPresenceService,
    private geoPresenceSrv: GeoPresenceService,
    private chatRouter: ChatRouterService
  ) {}

  init() {
    this.globalPresenceSrv.init();
    this.geoPresenceSrv.init();
  }

  private getOnlineUsersForRoute() {
    if (this.chatRouter.isGlobal) {
      return this.globalPresenceSrv.onlineUsers$;
    } else {
      return this.geoPresenceSrv.onlineUsersAtLocation$;
    }
  }

}
