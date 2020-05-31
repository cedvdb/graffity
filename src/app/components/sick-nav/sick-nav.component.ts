import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sick-nav',
  templateUrl: './sick-nav.component.html',
  styleUrls: ['./sick-nav.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.closed]': '!isOpen',
    '[class.open]': 'isOpen'
  }
})
export class SickNavComponent implements OnInit {
  @Input() isOpen = false;
  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
