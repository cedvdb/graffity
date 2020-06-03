import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  ngOnInit() {
    this.onResize();
  }

  /** needed so we can get full height on mobile */
  @HostListener('window:resize')
  onResize() {
    (document.querySelector(':root') as any).style
    .setProperty('--vh', window.innerHeight + 'px');
  }

}

