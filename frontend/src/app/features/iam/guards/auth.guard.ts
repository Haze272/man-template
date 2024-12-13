import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, take} from 'rxjs';
import {User} from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.activeUser$
    .pipe(
      take(1),
      map((user: User | null) => {
        if (!user) {
          router.navigate([`/auth/log-in`], { queryParams: { redirectTo: state.url }});
          return false;
        }

        return true;
      })
    );
};
