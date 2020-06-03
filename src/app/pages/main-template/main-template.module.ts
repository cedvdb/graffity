import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { MainTemplateComponent } from './main-template.component';



@NgModule({
  declarations: [MainTemplateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ { path: '', component: MainTemplateComponent }])
  ]
})
export class MainTemplateModule { }
