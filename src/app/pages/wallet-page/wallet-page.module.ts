import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/components/shared.module';
import { WalletPageComponent } from './wallet-page.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WalletPageComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ { path: '', component: WalletPageComponent }]),
    QRCodeModule
  ]
})
export class WalletPageModule { }
