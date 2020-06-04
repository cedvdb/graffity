import { Component, OnInit } from '@angular/core';
import { Theme, ThemingService } from './theming-service';

@Component({
  selector: 'app-theming-page',
  templateUrl: './theming-page.component.html',
  styleUrls: ['./theming-page.component.scss']
})
export class ThemingPageComponent implements OnInit {
  theme: Theme = {
    bg: document.documentElement.style.getPropertyValue('--color-bg'),
    bgNav1: document.documentElement.style.getPropertyValue('--color-bg-nav-1'),
    bgNav2: document.documentElement.style.getPropertyValue('--color-bg-nav-2'),
    bgNav3: document.documentElement.style.getPropertyValue('--color-bg-nav-3'),
    primary: document.documentElement.style.getPropertyValue('--color-primary'),
    accent: document.documentElement.style.getPropertyValue('--color-accent'),
    txt1: document.documentElement.style.getPropertyValue('--color-txt-primary'),
    txt2: document.documentElement.style.getPropertyValue('--color-txt-secondary'),
  };

  constructor(private themingSrv: ThemingService) { }

  ngOnInit(): void {

  }

  onChange() {
    this.themingSrv.applyTheme(this.theme);
    this.themingSrv.saveTheme(this.theme);
  }

  reset() {
    this.themingSrv.reset();
    location.reload();
  }

}
