import { Component, HostListener, OnInit } from '@angular/core';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app-sick-nav.scss'],
  host: {
    '[class.nav-opened]': 'isNavOpened',
    '[class.nav-closed]': '!isNavOpened'
  }
})
export class AppComponent implements OnInit {
  barsIcon = faBars;
  signOutIcon = faSignOutAlt;
  isNavOpened = false;

  ngOnInit() {
    this.onResize();
  }

  openNav(event: MouseEvent) {
    event.stopPropagation();
    this.isNavOpened = true;
  }

  @HostListener('click')
  closeNav() {
    this.isNavOpened = false;
  }

  /** needed so we can get full height on mobile */
  @HostListener('window:resize')
  onResize() {
    (document.querySelector(':root') as any).style
    .setProperty('--vh', window.innerHeight + 'px');
  }
}
