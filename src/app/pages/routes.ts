import { Routes } from '@angular/router';


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
