import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from '../../features/iam/services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    Button
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
