import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UserPictureModule } from './user-picture/user-picture.module';
import {TextFieldModule} from '@angular/cdk/text-field';


@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    TextFieldModule,
    // here
    UserPictureModule
  ]
})
export class SharedModule { }
