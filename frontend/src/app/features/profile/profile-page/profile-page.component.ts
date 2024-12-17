import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from '../../iam/services/auth.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-profile-page',
  imports: [
    AsyncPipe
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);

  get user$() {
    return this.authService.activeUser$
  }
}
