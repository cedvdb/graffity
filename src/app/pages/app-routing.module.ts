import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { WalletPageComponent } from './wallet-page/wallet-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SharedModule } from '../components/shared.module';
import { FirebaseUIModule } from 'firebaseui-angular';
import { QRCodeModule } from 'angularx-qrcode';


const routes: Routes = [

      {
        path: 'sign-in',
        component: SignInPageComponent,
        canActivate: [ AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectLoggedInTo(['chat']) },

      },
      {
        path: 'wallet',
        component: WalletPageComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['sign-in']) }
      },
      {
        path: 'chat',
        component: ChatPageComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['sign-in']) }
      }
];

@NgModule({
  declarations: [
    SignInPageComponent,
    WalletPageComponent,
    ChatPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false  }),
    SharedModule,
    FirebaseUIModule,
    QRCodeModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
