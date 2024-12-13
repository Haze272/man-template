import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const requiredRolesId = route.data['roles'] as number[];

  if (authService.hasRole(requiredRolesId)) {
    return true;
  }

  console.error('you dont have a permissions to do it');
  return false;
};
