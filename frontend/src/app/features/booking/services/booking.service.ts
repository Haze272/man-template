import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {Booking} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getAllUserBookings() {
    return this.http.get<Booking[]>(
      this.configService.config.bookingUrl + '/bookings/my',
      { withCredentials: true }
    );
  }

  cancelBooking(bookingId: number) {
    return this.http.patch(
      this.configService.config.bookingUrl + `/bookings/${bookingId}`,
      {
        statusId: 5
      },
      { withCredentials: true }
    )
  }
}
