import { Component, OnInit } from '@angular/core';
import { NanoService } from 'src/app/services/nano/nano.service';

@Component({
  selector: 'app-wallet-page',
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.scss']
})
export class WalletPageComponent implements OnInit {

  constructor(public walletSrv: NanoService) { }

  ngOnInit(): void {
  }


}
