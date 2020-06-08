import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GeoMessageService } from './_messaging/geo-message.service';
import { GlobalMessageService } from './_messaging/global-message.service';


enum Type {
  LOCATION,
  GLOBAL
}

@Injectable({ providedIn: 'root' })
export class MessageService {

  private type$ = new BehaviorSubject(Type.GLOBAL);
  private type: Type;
  messages$ = this.type$.pipe(
    distinctUntilChanged(),
    switchMap(type => this.getMessagesForType(type))
  );

  constructor(
    private geoMsgSrv: GeoMessageService,
    private globalMsgSrv: GlobalMessageService
  ) {}

  init() {
    this.type$.subscribe(type => this.type = type);
    this.globalMsgSrv.init();
    this.geoMsgSrv.init();
  }

  private getMessagesForType(type: Type) {
    if (type === Type.LOCATION) {
      return this.geoMsgSrv.messages$;
    } else {
      return this.globalMsgSrv.messages$;
    }
  }

  send(content: string) {
    if (this.type === Type.LOCATION) {
      return this.geoMsgSrv.send(content);
    } else {
      return this.globalMsgSrv.send(content);
    }
  }

  isGlobal() {
    return this.type === Type.GLOBAL;
  }

  listenToGlobalMessages() {
    this.type$.next(Type.GLOBAL);
  }

  listenToLocationMessages() {
    this.type$.next(Type.LOCATION);
  }

}
