import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPictureComponent } from './user-picture.component';



@NgModule({
  declarations: [UserPictureComponent],
  exports: [UserPictureComponent],
  imports: [
    CommonModule
  ]
})
export class UserPictureModule { }
