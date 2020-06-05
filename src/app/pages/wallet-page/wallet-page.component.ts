import { Component, OnInit } from '@angular/core';
import { NanoService } from 'src/app/services/nano/nano.service';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../../components/send-dialog/send-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent implements OnInit {
  recoveryMnemonic: string;

  constructor(
    public nanoSrv: NanoService,
    public dialog: MatDialog,
    private snackNar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.nanoSrv.fetchFunds();
  }

  openSendDlg() {
    this.dialog.open(SendDialogComponent);
  }

  recover() {
    if (!this.recoveryMnemonic) {
      return this.snackNar.open('you need to input your mnemonic in the field above (24words)');
    }
    this.nanoSrv.recover(this.recoveryMnemonic);
  }


}
