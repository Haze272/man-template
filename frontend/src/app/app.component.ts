import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './features/iam/services/auth.service';
import {map, Subject, takeUntil} from 'rxjs';
import {User} from './features/iam/models/user.model';
import {HeaderComponent} from './shared/header/header.component';
import {Toast} from 'primeng/toast';
import {AsyncPipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Toast, AsyncPipe, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  authService = inject(AuthService);

  #destroy$ = new Subject<void>()

  activeUser$ = this.authService.activeUser$
    .pipe(
      map(user => {
        return {
          ...user,
          roles: user?.roles.map(role => role.name)
        } as unknown as User;
      })
    )

  logout() {
    this.authService.logout().pipe(takeUntil(this.#destroy$)).subscribe();
  }
}
