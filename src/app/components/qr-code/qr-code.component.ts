import { Component, OnInit, Input } from '@angular/core';
import { faClone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
  faClone = faClone;
  @Input() data;
  @Input() text;
  constructor() { }

  ngOnInit(): void {
  }

}
