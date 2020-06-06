import { Component, HostListener, OnInit } from '@angular/core';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: [`
    :host {
      display: block;
      height: var(--vh);
    }
  `]
})
export class AppComponent implements OnInit {

  constructor(
    // private themingSrv: ThemingService,
  ) {}

  ngOnInit() {
    this.onResize();
    // this.themingSrv.loadTheme();
  }

  /** needed so we can get full height on mobile */
  @HostListener('window:resize')
  onResize() {
    (document.querySelector(':root') as any).style
    .setProperty('--vh', window.innerHeight + 'px');
  }

}

