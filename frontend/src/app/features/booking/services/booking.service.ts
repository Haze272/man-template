import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {Booking} from '../models/booking.model';
import {of, switchMap} from 'rxjs';
import {AuthService} from '../../iam/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly authService = inject(AuthService);

  getAllUserBookings() {
    return this.http.get<Booking[]>(
      this.configService.config.bookingUrl + '/bookings/my',
      { withCredentials: true }
    );
  }

  cancelBooking(bookingId: number) {
    return this.authService.activeUser$
      .pipe(
        switchMap((user) => {
          const isAdmin = user ? user.roles.map(role => role.id).includes(15) : false;

          return this.http.patch(
            this.configService.config.bookingUrl + `/bookings/${bookingId}`,
            {
              statusId: isAdmin ? 5 : 4,
            },
            { withCredentials: true }
          )
        })
      );
  }

  book(data: any) {
    const formattedData: Partial<Booking> = {
      bookDate: data.bookDate,
      persons: data.persons,
      comment: data.comment,
      table: data.roomId
    }

    return this.http.post(
      this.configService.config.bookingUrl + `/bookings`,
      formattedData,
      { withCredentials: true }
    );
  }
}
