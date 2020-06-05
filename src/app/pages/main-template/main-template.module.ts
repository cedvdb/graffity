import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { MainTemplateComponent } from './main-template.component';



@NgModule({
  declarations: [MainTemplateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ {
      path: '',
      component: MainTemplateComponent,
      children: [
        { path: 'chat', loadChildren: () => import('../chat-page/chat-page.module').then(m => m.ChatPageModule), },
        { path: 'wallet', loadChildren: () => import('../wallet-page/wallet-page.module').then(m => m.WalletPageModule), },
        { path: 'theming', loadChildren: () => import('../theming-page/theming-page.module').then(m => m.ThemingPageModule), },
        { path: '', pathMatch: 'full', redirectTo: 'chat' }
      ]
    }])
  ]
})
export class MainTemplateModule { }
