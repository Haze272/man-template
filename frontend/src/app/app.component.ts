import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './features/iam/services/auth.service';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, AsyncPipe, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  authService = inject(AuthService);

  activeUser$ = this.authService.activeUser$
    .pipe(
      map(user => {
        return {
          ...user,
          roles: user?.roles.map(role => role.name)
        }
      })
    )
}
