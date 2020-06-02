import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SickNavModule } from './sick-nav/sick-nav.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
    SickNavModule
  ]
})
export class SharedModule { }
