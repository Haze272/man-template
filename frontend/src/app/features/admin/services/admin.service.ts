import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {User} from '../../iam/models/user.model';
import {Role} from '../../iam/models/role.model';
import {iif, zip} from 'rxjs';
import {Table} from '../../booking/models/table.model';
import {TableType} from '../../booking/models/table-type.model';
import {Booking} from '../../booking/models/booking.model';
import {BookingStatus} from '../../booking/models/booking-status.model';

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

  getAllTables() {
    return this.http.get<Table[]>(
      this.configService.config.admin.url + `/`,
      { withCredentials: true }
    );
  }
  getTableById(id: number) {
    return this.http.get<Table>(
      this.configService.config.admin.url + `/rooms/${id}`,
      { withCredentials: true }
    );
  }
  updateTable(
    id: number,
    tableUpdateData: Partial<Table> & {
      tableTypeId?: number
    }) {
    return this.http.patch<Table>(
      this.configService.config.admin.url + `/rooms/${id}`,
      tableUpdateData,
      { withCredentials: true }
    );
  }

  getAllTableTypes() {
    return this.http.get<TableType[]>(
      this.configService.config.admin.url + `/rooms/types`,
      { withCredentials: true }
    );
  }

  getAllBookings() {
    return this.http.get<Booking[]>(
      this.configService.config.admin.url + `/bookings`,
      { withCredentials: true }
    );
  }
  getBookingById(id: number) {
    return this.http.get<Booking>(
      this.configService.config.admin.url + `/bookings/${id}`,
      { withCredentials: true }
    );
  }
  updateBooking(
    id: number,
    bookingUpdateData: Partial<Booking> & {
      statusId?: number,
      dateBookInt?: Date | string,
    }) {
    return this.http.patch<Booking>(
      this.configService.config.admin.url + `/bookings/${id}`,
      bookingUpdateData,
      { withCredentials: true }
    );
  }

  getAllBookingStatuses() {
    return this.http.get<BookingStatus[]>(
      this.configService.config.admin.url + `/bookings/statuses`,
      { withCredentials: true }
    );
  }
}
