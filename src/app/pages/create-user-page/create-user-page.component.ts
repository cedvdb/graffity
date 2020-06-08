import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.scss']
})
export class CreateUserPageComponent implements OnInit {
  pending$ = new Subject<boolean>();
  usernameCtrl = new FormControl('', Validators.required);

  constructor(
    private userSrv: UserService,
    private router: Router,
    private walletSrv: WalletService
  ) { }

  ngOnInit(): void {
  }

  submit() {
    this.pending$.next(true);
    const username = this.usernameCtrl.value;
    this.userSrv.createUser(username).pipe(
      switchMap(_ => this.userSrv.user$.pipe(filter(user => !!user))),
      switchMap(_ => this.walletSrv.wallet$)
    ).subscribe(_ => {
      this.pending$.next(false);
      this.router.navigate(['']);
    });
  }

}
