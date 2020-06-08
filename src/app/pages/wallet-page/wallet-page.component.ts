import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SendDialogComponent } from '../../components/send-dialog/send-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WalletService } from 'src/app/services/wallet.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { SeedDialogComponent } from './seed-dialog/seed-dialog.component';
import { LegacyWalletService } from 'src/app/services/_nano/legacy-wallet.service';
import { AutoUnsub } from 'src/app/components/abstract-auto-unsub.component';
import { first, takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent extends AutoUnsub implements OnInit {
  faEye = faEye;
  legacySyncPending = false;

  constructor(
    public walletSrv: WalletService,
    public legacyWalletSrv: LegacyWalletService,
    public dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.walletSrv.refreshFunds()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe();
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

  syncLegacy() {
    this.legacySyncPending = true;
    this.legacyWalletSrv.transferFundsToSynced()
      .subscribe(_ => this.legacySyncPending = false);
  }

  destroyLegacy() {
    this.legacyWalletSrv.destroy();
  }
}
