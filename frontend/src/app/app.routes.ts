import { Routes } from '@angular/router';
import {SignInPageComponent} from './features/iam/pages/sign-in-page/sign-in-page.component';
import {SignUpPageComponent} from './features/iam/pages/sign-up-page/sign-up-page.component';
import {TestHiddenPageComponent} from './features/_test/pages/test-hidden-page/test-hidden-page.component';
import {authGuard} from './features/iam/guards/auth.guard';
import {noLoginGuard} from './features/iam/guards/no-login.guard';
import {roleGuard} from './features/iam/guards/role.guard';
import {ProfilePageComponent} from './features/profile/profile-page/profile-page.component';
import {HomePageComponent} from './features/booking/pages/home-page/home-page.component';
import {AdminHomePageComponent} from './features/admin/admin-home-page/admin-home-page.component';
import {SandboxPageComponent} from './features/_dev/pages/sandbox-page/sandbox-page.component';
import {MyBooksPageComponent} from './features/booking/pages/my-books-page/my-books-page.component';
import {RoomPageComponent} from './features/booking/pages/room-page/room-page.component';
import {RoomListPageComponent} from './features/booking/pages/room-list-page/room-list-page.component';
import {BookPageComponent} from './features/booking/pages/book-page/book-page.component';
import {AdminUserListPageComponent} from './features/admin/admin-user-list-page/admin-user-list-page.component';
import {AdminRoomListPageComponent} from './features/admin/admin-room-list-page/admin-room-list-page.component';
import {AdminBookListPageComponent} from './features/admin/admin-book-list-page/admin-book-list-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [3] },
    children: [
      { path: '', component: AdminHomePageComponent, pathMatch: 'full' },
      {
        path: 'book',
        children: [
          { path: 'list', component: AdminBookListPageComponent }
        ]
      },
      {
        path: 'room',
        children: [
          { path: 'list', component: AdminRoomListPageComponent }
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
    canActivate: [noLoginGuard],
    children: [
      { path: 'log-in', component: SignInPageComponent },
      { path: 'sign-up', component: SignUpPageComponent },
    ]
  },

  {
    path: 'book',
    children: [
      {
        path: 'room',
        children: [
          { path: 'list', component: RoomListPageComponent },
          { path: ':id', component: RoomPageComponent }
        ]
      },
      { path: ':id', component: BookPageComponent },
      { path: 'list', component: MyBooksPageComponent }
    ]
  },

  {
    path: 'dev',
    children: [
      { path: 'sandbox', component: SandboxPageComponent }
    ]
  }
];
