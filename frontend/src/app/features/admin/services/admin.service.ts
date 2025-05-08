import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {User} from '../../iam/models/user.model';
import {Role} from '../../iam/models/role.model';
import {iif, zip} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getAllUsers() {
    return this.http.get<User[]>(
      this.configService.config.admin.url + '/users',
      { withCredentials: true }
    );
  }
  getUserById(id: number) {
    return this.http.get<User>(
      this.configService.config.admin.url + `/users/${id}`,
      { withCredentials: true }
    );
  }
  updateUser(id: number, userUpdateData: Partial<User> & { status?: number, rolesIds?: number[] }) {
    return iif(
      () => !!userUpdateData.rolesIds && userUpdateData.rolesIds.length > 0,
      zip(
        this.http.patch<User>(
          this.configService.config.admin.url + `/users/${id}`,
          userUpdateData,
          { withCredentials: true }
        ),
        this.http.patch<void>(
          this.configService.config.admin.url + `/users/${id}/roles`,
          {
            rolesId: userUpdateData.rolesIds,
          },
          { withCredentials: true }
        )
      ),
      this.http.patch<User>(
        this.configService.config.admin.url + `/users/${id}`,
        userUpdateData,
        { withCredentials: true }
      )
    );
  }

  getAllRoles() {
    return this.http.get<Role[]>(
      this.configService.config.admin.url + `/roles`,
      { withCredentials: true }
    );
  }
}
