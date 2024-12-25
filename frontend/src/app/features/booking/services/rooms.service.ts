import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Room} from '../models/room.model';
import {ConfigService} from '../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getAllRooms() {
    return this.http.get<Room[]>(
      this.configService.config.bookingUrl + '/rooms',
      { withCredentials: true }
    )
  }

  getRoomById(roomId: number) {
    return this.http.get<Room>(
      this.configService.config.bookingUrl + `/rooms/${roomId}`,
      { withCredentials: true }
    );
  }
}
