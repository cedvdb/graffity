import { Component, OnInit } from '@angular/core';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  faPaintBrush = faPaintBrush;

  constructor() { }

  ngOnInit(): void {
  }

}
