import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})
export class SendDialogComponent implements OnInit {
  data = {
    address: '',
    amount: 0,
  };
  constructor() { }

  ngOnInit(): void {
  }

}
