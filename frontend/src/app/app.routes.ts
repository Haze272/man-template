import { Routes } from '@angular/router';
import {TestPageComponent} from './features/_test/pages/test-page/test-page.component';
import {SignInPageComponent} from './features/iam/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/iam/pages/sign-up-page/sign-up-page.component';
import {TestHiddenPageComponent} from './features/_test/pages/test-hidden-page/test-hidden-page.component';
import {
  TestAuthenticatedPageComponent
} from './features/_test/pages/test-authenticated-page/test-authenticated-page.component';
import {authGuard} from './features/iam/guards/auth.guard';
import {noLoginGuard} from './features/iam/guards/no-login.guard';
import {roleGuard} from './features/iam/guards/role.guard';

export const routes: Routes = [
  { path: '', component: TestPageComponent, pathMatch: 'full' },
  { path: 'profile', component: TestAuthenticatedPageComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: TestHiddenPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [3] }
  },

  {
    path: 'auth',
    canActivate: [noLoginGuard],
    children: [
      { path: 'log-in', component: SignInPageComponent },
      { path: 'sign-up', component: SignUpPageComponent },
    ]
  }
];
