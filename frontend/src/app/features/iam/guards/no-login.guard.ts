import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, takeUntil, timer, withLatestFrom} from 'rxjs';

export const noLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const activatedRoute = inject(ActivatedRoute);

  return timer(2000)
    .pipe(
      withLatestFrom(authService.activeUser$, activatedRoute.queryParams),
      map(([wtf, user, params]) => {
        if (user) {
          console.log('[no-login.guard.ts]: person already logged!')
          console.log('params', params)
          if (params && params['redirectTo']) {
            router.navigateByUrl(params['redirectTo']);
          } else {
            router.navigateByUrl(`/`);
          }

          return false;
        }

        return true;
      })
    )
};
