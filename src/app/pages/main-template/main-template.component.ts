import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { GeolocationService } from 'src/app/services/geolocation.service';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss', './sick-nav.scss'],
  host: {
    '[class.nav-opened]': 'isNavOpened',
    '[class.nav-closed]': '!isNavOpened'
  }
})
export class MainTemplateComponent {
  barsIcon = faBars;
  signOutIcon = faSignOutAlt;
  isNavOpened = false;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private geolocationSrv: GeolocationService
  ) {
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

  goToNewYork(): void {
    this.geolocationSrv.goToNewYork();
  }

  goToMyLocation(): void {
    this.geolocationSrv.goToMyLocation();
  }

  isLoc() {
    return this.geolocationSrv.userIsAt === 'LOC';
  }

  isNy() {
    return this.geolocationSrv.userIsAt === 'NY';
  }
}
