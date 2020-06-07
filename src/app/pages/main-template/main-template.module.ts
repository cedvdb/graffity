import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { MainTemplateComponent } from './main-template.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HasUser } from 'src/app/guards/has-user.guard';



@NgModule({
  declarations: [MainTemplateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ {
      path: '',
      component: MainTemplateComponent,
      canActivate: [AngularFireAuthGuard, HasUser],
      data: { authGuardPipe: () => redirectUnauthorizedTo(['sign-in']) },
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
