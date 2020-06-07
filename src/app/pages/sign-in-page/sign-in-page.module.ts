import { NgModule } from '@angular/core';
import { FirebaseUIModule } from 'firebaseui-angular';
import { SharedModule } from 'src/app/components/shared.module';
import { firebaseUiAuthConfig } from './firebase-ui-config';
import { SignInPageComponent } from './sign-in-page.component';
import { RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/auth-guard';



@NgModule({
  declarations: [SignInPageComponent],
  imports: [
    SharedModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    RouterModule.forChild([ {
      path: '',
      component: SignInPageComponent,
      canActivate: [AngularFireAuthGuard],
      data: { authGuardPipe: () => redirectLoggedInTo(['']) },
    }])
  ]
})
export class SignInPageModule { }
