import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { WalletPageComponent } from './wallet-page/wallet-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MainPageComponent } from '../main-page/main-page.component';
import { AuthPageComponent } from '../auth-page/auth-page.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth', 'login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['chat']);

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
    data: { authGuardPipe: () => redirectUnauthorizedTo(['auth', 'login']) },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
