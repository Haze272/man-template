import { Routes } from '@angular/router';
import {SignInPageComponent} from './features/iam/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/iam/pages/sign-up-page/sign-up-page.component';
import {authGuard} from './features/iam/guards/auth.guard';
import {roleGuard} from './features/iam/guards/role.guard';
import {ProfilePageComponent} from './features/profile/profile-page/profile-page.component';
import {HomePageComponent} from './features/home/home-page/home-page.component';
import {SandboxPageComponent} from './features/_dev/pages/sandbox-page/sandbox-page.component';
import {AdminUserListPageComponent} from './features/admin/pages/admin-user-list-page/admin-user-list-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [5] },
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        component: AdminUserListPageComponent
      }
    ]
  },

  {
    path: 'auth',
    children: [
      { path: 'log-in', component: SignInPageComponent },
      { path: 'sign-up', component: SignUpPageComponent },
    ]
  },

  {
    path: 'dev',
    children: [
      { path: 'sandbox', component: SandboxPageComponent }
    ]
  }
];
