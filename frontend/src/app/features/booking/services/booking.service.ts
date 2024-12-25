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
    // {
    //   "userId": 4,
    //   "roomId": 6,
    //   "dateStartInt": "2024-12-10T21:00:00.000Z",
    //   "dateEndInt": "2024-12-10T21:00:00.000Z",
    //   "persons": 3,
    //   "comment": ""
    // }
    const formattedData: Partial<Booking> = {
      dateStart: data.period[0],
      dateEnd: data.period[1],
      date: new Date(),
      persons: data.persons,
      comment: data.comment,
      room: data.roomId
    }

    return this.http.post(
      this.configService.config.bookingUrl + `/bookings`,
      formattedData,
      { withCredentials: true }
    );
  }
}
