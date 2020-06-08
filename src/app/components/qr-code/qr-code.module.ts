import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QRCodeModule as NgxQRCodeModule } from 'angularx-qrcode';
import { QrCodeComponent } from './qr-code.component';



@NgModule({
  declarations: [QrCodeComponent],
  exports: [QrCodeComponent],
  imports: [
    CommonModule,
    NgxQRCodeModule,
    FontAwesomeModule,
    MatTooltipModule,
    ClipboardModule,
  ]
})
export class QrCodeModule { }
