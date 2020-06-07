import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';

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
  barsIcon = faBars;
  signOutIcon = faSignOutAlt;
  isNavOpened = false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private geolocationSrv: GeolocationService,
    private messageSrv: MessageService,
    private presenceSrv: PresenceService,
  ) {
  }

  ngOnInit() {
    this.geolocationSrv.getUserCoordinates();
    this.messageSrv.init();
    this.presenceSrv.init();
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


  get hasLocation() {
    return this.geolocationSrv.hasLocation;
  }

}
