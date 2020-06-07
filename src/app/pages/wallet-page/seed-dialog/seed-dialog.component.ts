import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-seed-dialog',
  templateUrl: './seed-dialog.component.html',
  styleUrls: ['./seed-dialog.component.scss']
})
export class SeedDialogComponent implements OnInit {

  constructor(public walletSrv: WalletService) { }

  ngOnInit(): void {
  }

}
