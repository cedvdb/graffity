import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HasUserGuard } from './guards/has-user.guard';
import { HasWalletGuard } from './guards/has-wallet.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public hasUserGuard: HasUserGuard,
    public hasWalletGuard: HasWalletGuard,
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

