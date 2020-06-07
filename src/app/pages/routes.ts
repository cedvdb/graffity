import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { MainTemplateComponent } from './main-template/main-template.component';
import { WalletPageComponent } from './wallet-page/wallet-page.component';
import { HasUser } from '../guards/has-user.guard';
import { HasWallet } from '../guards/has-wallet.guard';




export const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in-page/sign-in-page.module').then(m => m.SignInPageModule),
  },
  {
    path: 'create-user',
    loadChildren: () => import('./create-user-page/create-user-page.module').then(m => m.CreateUserPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./main-template/main-template.module').then(m => m.MainTemplateModule),
  }
];
