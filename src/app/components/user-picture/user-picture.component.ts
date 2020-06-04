import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-picture',
  templateUrl: './user-picture.component.html',
  styleUrls: ['./user-picture.component.scss'],
  host: {
    '[class.m]': 'size === "m"'
  }
})
export class UserPictureComponent implements OnInit {

  @Input() url;
  @Input() size = 'm';

  constructor() { }

  ngOnInit(): void {
  }

}
