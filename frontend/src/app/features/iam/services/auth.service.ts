import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../storage/local-storage.service';
import {User} from '../models/user.model';
import {BehaviorSubject, of, switchMap, throwError} from 'rxjs';
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
    return this.http.post(
      this.configService.config.auth.url + '/authentication/sign-in',
      {
        email: login,
        password: password
      }
    ).pipe(
      switchMap((response: any) => {
        if (response) {
          this.activeUser$.next(response.userData)
          this.localStorageService.saveData('user', JSON.stringify(response.userData));

          return of({});
        } else {
          return throwError(() => {
            return new Error('Пароль неверный или пользователь не существует!')
          })
        }
      })
    );
  }

  autoLogin() {
    const userJSON = this.localStorageService.getData('user');

    if (userJSON) {
      const user = JSON.parse(userJSON);
      this.activeUser$.next(user);
      return of(user);
    } else {
      return throwError(() => {
        return new Error('Пользователь не авторизирован');
      })
    }
  }

  logout() {
    this.localStorageService.removeData('user');

    window.location.reload();
  }

  hasRole(requiredRoles: number[]): boolean {
    if (!this.activeUser$.value) return false;

    return this.activeUser$.value.roles.some(role =>
      requiredRoles.includes(role.id)
    );
  }
}