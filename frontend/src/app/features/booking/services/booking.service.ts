import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {Booking} from '../models/booking.model';
import {of} from 'rxjs';

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
