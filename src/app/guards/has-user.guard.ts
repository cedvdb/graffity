import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { log } from 'simply-logs';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class HasUserGuard implements CanActivate {

  private loading$ = new Subject<boolean>();
  public loading = false;

  constructor(
    private userSrv: UserService,
    private router: Router,
  ) {
    this.loading$.pipe(debounceTime(300))
    .subscribe(loading => this.loading = loading);
  }

  canActivate() {
    this.loading$.next(true);
    log.debug('has user guard');
    return this.userSrv.user$.pipe(
      map(user => !!user),
      tap(_ => this.loading$.next(false)),
      tap(user => this.redirect(user)),
      tap(d => log.debug('has user guard end', d))
    );
  }

  redirect(hasUser: boolean) {
    if (!hasUser) {
      this.router.navigate(['create-user']);
    }
  }
}
