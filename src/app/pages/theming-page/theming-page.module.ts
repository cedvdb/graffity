import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { ThemingPageComponent } from './theming-page.component';
import { ColorPickerModule } from 'ngx-color-picker';



@NgModule({
  declarations: [ThemingPageComponent],
  imports: [
    SharedModule,
    ColorPickerModule,
    RouterModule.forChild([ { path: '', component: ThemingPageComponent }])
  ]
})
export class ThemingPageModule { }
