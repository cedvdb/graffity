import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
  constructor(private dialogRef: MatDialogRef<SendDialogComponent>) { }

  ngOnInit(): void {
  }
}
