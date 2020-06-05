import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UserPictureModule } from './user-picture/user-picture.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule} from '@angular/cdk-experimental/scrolling';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    // libs
    FontAwesomeModule,
    // cdk
    TextFieldModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    // here
    UserPictureModule
  ]
})
export class SharedModule { }
