import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.scss']
})
export class CreateUserPageComponent implements OnInit {
  pending = false;
  usernameCtrl = new FormControl('', Validators.required);

  constructor(private userSrv: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    this.pending = true;
    const username = this.usernameCtrl.value;
    this.userSrv.createUser(username)
      .subscribe(_ => this.router.navigate(['']));
  }

}
