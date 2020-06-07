import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../../components/send-dialog/send-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WalletService } from 'src/app/services/wallet.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { SeedDialogComponent } from './seed-dialog/seed-dialog.component';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent implements OnInit {
  faEye = faEye;

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

  openAddressDlg() {
    this.dialog.open(AddressDialogComponent);
  }

  openSeedDlg() {
    this.dialog.open(SeedDialogComponent);
  }

}
