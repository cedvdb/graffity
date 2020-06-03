import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared.module';
import { routes } from './routes';
import { MainTemplateModule } from './main-template/main-template.module';
import { SignInPageModule } from './sign-in-page/sign-in-page.module';
import { WalletPageModule } from './wallet-page/wallet-page.module';



@NgModule({
  imports: [
    MainTemplateModule,
    SignInPageModule,
    WalletPageModule,
    RouterModule.forRoot(routes, { enableTracing: false  }),
    SharedModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
