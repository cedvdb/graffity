import { CanActivate, Router } from '@angular/router';
import { map, tap, debounceTime } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HasUserGuard implements CanActivate {

  private loading$ = new Subject<boolean>();
  public loading = false;

  constructor(
    private userSrv: UserService,
    private router: Router
  ) {
    this.loading$.pipe(debounceTime(300))
    .subscribe(loading => this.loading = loading);
  }

  canActivate() {
    this.loading$.next(true);
    return this.userSrv.user$.pipe(
      map(user => !!user),
      tap(_ => this.loading$.next(false)),
      tap(user => this.redirect(user))
    );
  }

  redirect(hasUser: boolean) {
    if (!hasUser) {
      this.router.navigate(['create-user']);
    }
  }
}
