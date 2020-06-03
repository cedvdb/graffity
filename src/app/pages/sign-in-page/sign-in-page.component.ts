import { Component, OnInit } from '@angular/core';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  faWallet = faWallet;

  constructor() { }

  ngOnInit(): void {
  }

}
