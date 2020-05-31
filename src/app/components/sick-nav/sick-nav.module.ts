import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SickNavComponent } from './sick-nav.component';



@NgModule({
  declarations: [SickNavComponent],
  exports: [ SickNavComponent ],
  imports: [
    CommonModule
  ]
})
export class SickNavModule { }
