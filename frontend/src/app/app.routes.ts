import { Routes } from '@angular/router';
import {SignInPageComponent} from './features/iam/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/iam/pages/sign-up-page/sign-up-page.component';
import {authGuard} from './features/iam/guards/auth.guard';
import {roleGuard} from './features/iam/guards/role.guard';
import {ProfilePageComponent} from './features/profile/profile-page/profile-page.component';
import {HomePageComponent} from './features/booking/pages/home-page/home-page.component';
import {SandboxPageComponent} from './features/_dev/pages/sandbox-page/sandbox-page.component';
import {MyBooksPageComponent} from './features/booking/pages/my-books-page/my-books-page.component';
import {TableListPageComponent} from './features/booking/pages/table-list-page/table-list-page.component';
import {BookPageComponent} from './features/booking/pages/book-page/book-page.component';
import {AdminUserListPageComponent} from './features/admin/pages/admin-user-list-page/admin-user-list-page.component';
import {AdminTableListPageComponent} from './features/admin/pages/admin-table-list-page/admin-table-list-page.component';
import {AdminBookListPageComponent} from './features/admin/pages/admin-book-list-page/admin-book-list-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [5] },
    children: [
      { path: '', redirectTo: 'book', pathMatch: 'full' },
      {
        path: 'book',
        children: [
          { path: 'list', component: AdminBookListPageComponent }
        ]
      },
      {
        path: 'table',
        children: [
          { path: 'list', component: AdminTableListPageComponent }
        ]
      },
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
    path: 'book',
    children: [
      {
        path: 'table',
        children: [
          { path: 'list', component: TableListPageComponent },
        ]
      },
      { path: 'list', component: MyBooksPageComponent },
      { path: ':tableId', component: BookPageComponent, pathMatch: 'full' },
    ]
  },

  {
    path: 'dev',
    children: [
      { path: 'sandbox', component: SandboxPageComponent }
    ]
  }
];
