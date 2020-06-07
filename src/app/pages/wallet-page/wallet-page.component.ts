import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../../components/send-dialog/send-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent implements OnInit {
  recoveryMnemonic: string;
  recoveryPending = false;

  constructor(
    public walletSrv: WalletService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.walletSrv.refreshFunds();
  }

  openSendDlg() {
    this.dialog.open(SendDialogComponent);
  }

}
