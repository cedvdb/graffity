import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { faClone } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  faClone = faClone;
  constructor(public walletSrv: WalletService) { }

  ngOnInit(): void {
  }

}
