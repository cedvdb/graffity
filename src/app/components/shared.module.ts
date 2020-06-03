import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    HttpClientModule,
  ]
})
export class SharedModule { }
