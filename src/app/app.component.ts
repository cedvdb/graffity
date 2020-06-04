import { Component, HostListener, OnInit } from '@angular/core';
import { ThemingService } from './pages/theming-page/theming-service';
import { GeolocationService } from './services/geolocation.service';
import { MessageService } from './services/message.service';

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
    private themingSrv: ThemingService,
    private geolocationSrv: GeolocationService,
    private messageSrv: MessageService
  ) {}

  ngOnInit() {
    this.onResize();
    this.geolocationSrv.getUserCoordinates();
    this.themingSrv.loadTheme();
    this.messageSrv.init();
  }

  /** needed so we can get full height on mobile */
  @HostListener('window:resize')
  onResize() {
    (document.querySelector(':root') as any).style
    .setProperty('--vh', window.innerHeight + 'px');
  }

}

