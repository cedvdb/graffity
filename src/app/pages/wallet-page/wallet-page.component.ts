import { Component, OnInit } from '@angular/core';
import { NanoService } from 'src/app/services/nano/nano.service';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../../components/send-dialog/send-dialog.component';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent implements OnInit {

  constructor(
    public nanoSrv: NanoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openSendDlg() {
    const dialogRef = this.dialog.open(SendDialogComponent);

    dialogRef.afterClosed().pipe(
    ).subscribe(result => {
      if (result) {
        this.nanoSrv.send(result.toAddress, result.amountNano);
      }
    });
  }


}
