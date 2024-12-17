import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, take} from 'rxjs';
import {User} from '../models/user.model';

export const noLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.activeUser$
    .pipe(
      take(1),
      map((user: User | null) => {
        if (user) {
          console.log('[no-login.guard.ts]: person already logged!')
          router.parseUrl(`/`);
          return false;
        }

        return true;
      })
    );
};
