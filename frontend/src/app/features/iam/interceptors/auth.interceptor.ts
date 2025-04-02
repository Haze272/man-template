import {HttpContextToken, HttpErrorResponse, HttpEventType, HttpInterceptorFn} from '@angular/common/http';
import {catchError, of, switchMap, tap, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => []);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const ignoredStatuses = req.context.get(IGNORED_STATUSES);

  return next(req).pipe(
    tap(v => {
      console.log('interceptor start', v.type)
    }),
    catchError((e: HttpErrorResponse, caught) => {

      // if ignored statuses are set
      // and returned status matched
      if (ignoredStatuses?.includes(e.status)) {
        // rethrow error to be catched locally
        return throwError(() => e);
      }

      // process error...
      console.log('error interceptor !!', e);
      if (e.status === 401) {
        return authService.refreshTokens().pipe(
          switchMap(v => {
            return next(req)
          })
        );
      }
      return of();
    }),
    tap(v => {
      console.log('interceptor end', v.type)
    }),
  );
};
