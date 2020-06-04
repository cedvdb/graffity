import { Injectable } from '@angular/core';


export interface Theme {
  bg: string;
  bgNav1: string;
  bgNav2: string;
  bgNav3: string;
  primary: string;
  accent: string;
  txt1: string;
  txt2: string;
}

@Injectable({ providedIn: 'root' })
export class ThemingService {

  loadTheme() {
    const themeJson = localStorage.getItem('THEME');
    if (themeJson) {
      const theme: Theme = JSON.parse(themeJson);
      this.applyTheme(theme);
    }
  }

  applyTheme(theme: Theme) {
    document.documentElement.style.setProperty('--color-bg', theme.bg);
    document.documentElement.style.setProperty('--color-bg-nav-1', theme.bgNav1);
    document.documentElement.style.setProperty('--color-bg-nav-2', theme.bgNav2);
    document.documentElement.style.setProperty('--color-bg-nav-3', theme.bgNav3);
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-txt-primary', theme.txt1);
    document.documentElement.style.setProperty('--color-txt-secondary', theme.txt2);
  }

  saveTheme(theme: Theme) {
    localStorage.setItem('THEME', JSON.stringify(theme));
  }

  reset() {
    localStorage.removeItem('THEME');
  }
}
