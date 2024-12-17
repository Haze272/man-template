import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../storage/local-storage.service';
import {User} from '../models/user.model';
import {BehaviorSubject, of, switchMap, tap, throwError} from 'rxjs';
import {ConfigService} from '../../config/config.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  localStorageService = inject(LocalStorageService);
  http = inject(HttpClient);
  configService = inject(ConfigService);

  activeUser$ = new BehaviorSubject<User | null>(null)

  signIn(login: string, password: string) {
    return this.http.post<{ userData: User, refreshToken: string }>(
      this.configService.config.auth.url + '/authentication/sign-in',
      {
        email: login,
        password: password
      },
      {
        withCredentials: true
      }
    ).pipe(
      switchMap((response) => {
        if (response) {
          this.activeUser$.next(response.userData)
          this.localStorageService.saveData('user', JSON.stringify(response.userData));
          sessionStorage.setItem('refreshToken', response.refreshToken);

          return of({});
        } else {
          return throwError(() => {
            return new Error('Пароль неверный или пользователь не существует!')
          })
        }
      })
    );
  }

  // TODO протестировать регистрацию и диалог
  signUp(username: string, email: string, password: string) {
    return this.http.post(
      this.configService.config.auth.url + '/authentication/sign-up',
      {
        username: username,
        email: email,
        password: password
      },
      {
        withCredentials: true
      }
    ).pipe(
      switchMap((response: any) => {
        if (response) {
          this.activeUser$.next(response.userData)
          this.localStorageService.saveData('user', JSON.stringify(response.userData));

          return of({});
        } else {
          return throwError(() => {
            return new Error('Регистрация не прошла успешно!')
          })
        }
      })
    );
  }

  autoLogin() {
    return this.http.post<{ userData: User, refreshToken: string }>(
      this.configService.config.auth.url + '/authentication/autologin',
      {},
      {
        withCredentials: true
      }
    ).pipe(
      switchMap(response => {
        if (response) {
          this.activeUser$.next(response.userData);
          this.localStorageService.saveData('user', JSON.stringify(response.userData));
          sessionStorage.setItem('refreshToken', response.refreshToken);

          return of(response.userData);
        } else {
          return throwError(() => {
            return new Error('Пользователь не авторизирован');
          })
        }
      })
    );
  }

  logout() {
    this.localStorageService.removeData('user');

    return this.http.post(
      this.configService.config.auth.url + '/authentication/logout',
      {},
      {
        withCredentials: true
      }
    ).pipe(
      tap(() => {
        window.location.reload();
      })
    );
  }

  hasRole(requiredRoles: number[]): boolean {
    if (!this.activeUser$.value) return false;

    return this.activeUser$.value.roles.some(role =>
      requiredRoles.includes(role.id)
    );
  }
}
