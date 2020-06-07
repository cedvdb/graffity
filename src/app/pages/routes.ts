import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { MainTemplateComponent } from './main-template/main-template.component';
import { WalletPageComponent } from './wallet-page/wallet-page.component';
import { HasUser } from '../guards/has-user.guard';




export const routes: Routes = [
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in-page/sign-in-page.module').then(m => m.SignInPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo(['']) },
  },
  {
    path: 'create-user',
    loadChildren: () => import('./create-user-page/create-user-page.module').then(m => m.CreateUserPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['sign-in']) }
  },
  {
    path: '',
    loadChildren: () => import('./main-template/main-template.module').then(m => m.MainTemplateModule),
    canActivate: [AngularFireAuthGuard, HasUser],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['sign-in']) }
  }
];
