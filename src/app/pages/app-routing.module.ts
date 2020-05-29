import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInPageComponent } from './auth-page/sign-in-page/sign-in-page.component';
import { WalletPageComponent } from './main-page/wallet-page/wallet-page.component';
import { ChatPageComponent } from './main-page/chat-page/chat-page.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { SharedModule } from '../shared/shared.module';
import { FirebaseUIModule } from 'firebaseui-angular';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    data: { authGuardPipe: () => redirectLoggedInTo(['chat']) },
    children: [
      { path: 'sign-in', component: SignInPageComponent },
    ]
  },
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(['auth', 'sign-in']) },
    children: [
      { path: 'wallet', component: WalletPageComponent },
      { path: 'chat', component: ChatPageComponent },
      { path: '', redirectTo: 'chat', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    MainPageComponent,
    AuthPageComponent,
    SignInPageComponent,
    WalletPageComponent,
    ChatPageComponent
  ],
  imports: [RouterModule.forRoot(routes), SharedModule, FirebaseUIModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
