import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum ChatRoute {
  LOCAL,
  GLOBAL
}

@Injectable({ providedIn: 'root' })
export class ChatRouterService {

  route$ = new BehaviorSubject(ChatRoute.GLOBAL);
  private route: ChatRoute;

  init() {
    this.route$.subscribe(route => this.route = route);
  }

  get isGlobal() {
    return this.route === ChatRoute.GLOBAL;
  }

  goToGlobalChat() {
    this.route$.next(ChatRoute.GLOBAL);
  }

  goToLocalChat() {
    this.route$.next(ChatRoute.LOCAL);
  }

}
