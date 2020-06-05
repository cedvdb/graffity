import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NanoService } from 'src/app/services/nano/nano.service';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})
export class SendDialogComponent implements OnInit {
  address: '';
  amount: 0;
  pending = false;

  constructor(
    private dialogRef: MatDialogRef<SendDialogComponent>,
    private nanoSrv: NanoService
  ) { }

  ngOnInit(): void {
  }

  send() {
    this.pending = true;
    this.nanoSrv.send(this.address, this.amount).subscribe(_ => {
      this.pending = false;
      this.dialogRef.close();
    });
  }

}
