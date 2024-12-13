import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sign-up-page',
  imports: [],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpPageComponent {
  private readonly authService = inject(AuthService);

}
