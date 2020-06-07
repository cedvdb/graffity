import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserPageComponent } from './create-user-page.component';
import { SharedModule } from 'src/app/components/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [CreateUserPageComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ { path: '', component: CreateUserPageComponent }])
  ]
})
export class CreateUserPageModule { }
