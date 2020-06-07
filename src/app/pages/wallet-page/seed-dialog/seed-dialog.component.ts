import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { faClone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seed-dialog',
  templateUrl: './seed-dialog.component.html',
  styleUrls: ['./seed-dialog.component.scss']
})
export class SeedDialogComponent implements OnInit {
  faClone = faClone;
  constructor(public walletSrv: WalletService) { }

  ngOnInit(): void {
  }

}
