import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SickNavModule } from './sick-nav/sick-nav.module';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FontAwesomeModule,
    SickNavModule
  ]
})
export class SharedModule { }
