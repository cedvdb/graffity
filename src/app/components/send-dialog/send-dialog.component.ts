import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})
export class SendDialogComponent implements OnInit {
  address = '';
  amount = 0;
  pending = false;

  constructor(
    private dialogRef: MatDialogRef<SendDialogComponent>,
    private walletSrv: WalletService,
    @Inject(MAT_DIALOG_DATA) private data: { address: string, amount: number }
  ) { }

  ngOnInit(): void {
    this.address = this.data?.address;
    this.amount = this.data?.amount;
  }

  send() {
    this.pending = true;
    this.walletSrv.send(this.address, this.amount).subscribe(_ => {
      this.pending = false;
      this.dialogRef.close();
    });
  }

}
