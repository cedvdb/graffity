import { CanActivate, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HasUser implements CanActivate {

  constructor(
    private userSrv: UserService,
    private router: Router
  ) {}

  canActivate() {
    return this.userSrv.user$.pipe(
      map(user => !!user),
      tap(user => this.redirect(user))
    );
  }

  redirect(hasUser: boolean) {
    if (!hasUser) {
      this.router.navigate(['create-user']);
    }
  }
}
