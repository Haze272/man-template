import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-admin-home-page',
  imports: [],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomePageComponent {
  private readonly adminService = inject(AdminService);

}
