import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from '../../features/iam/services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    Button,
    Menu
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  accountMenuItems: MenuItem[] = [
    {
      label: 'Личный кабинет',
      icon: 'pi pi-user',
      command: () => {
        this.router.navigate(['/profile']);
      }
    },
    {
      label: 'Выйти из аккаунта',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.logout().subscribe(); // TODO перенести подписку
      }
    }
  ];
}
