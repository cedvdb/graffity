import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ChatRouterService } from 'src/app/services/chat-router.service';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';
import { WalletService } from 'src/app/services/wallet.service';
import { LegacyWalletService } from 'src/app/services/_nano/legacy-wallet.service';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss', './sick-nav.scss'],
  host: {
    '[class.nav-opened]': 'isNavOpened',
    '[class.nav-closed]': '!isNavOpened'
  }
})
export class MainTemplateComponent implements OnInit {
  faBars = faBars;
  signOutIcon = faSignOutAlt;
  isNavOpened = true;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private geolocationSrv: GeolocationService,
    private chatRouterSrv: ChatRouterService,
    private messageSrv: MessageService,
    private presenceSrv: PresenceService,
    private walletSrv: WalletService,
    private legacyWalletSrv: LegacyWalletService
  ) {
  }

  ngOnInit() {
    this.geolocationSrv.init();
    this.chatRouterSrv.init();
    this.messageSrv.init();
    this.presenceSrv.init();
    this.walletSrv.init();
    this.legacyWalletSrv.init();
  }

  openNav(event: MouseEvent) {
    event.stopPropagation();
    this.isNavOpened = true;
  }

  @HostListener('click')
  closeNav() {
    this.isNavOpened = false;
  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['sign-in']);
  }

  goToLocalChat() {
    // navigate back in case we are in wallet
    this.router.navigate(['chat']);
    this.chatRouterSrv.goToLocalChat();
  }

  goToGlobalChat() {
    this.router.navigate(['chat']);
    this.chatRouterSrv.goToGlobalChat();
  }

  get isGlobal() {
    return this.chatRouterSrv.isGlobal;
  }


}
