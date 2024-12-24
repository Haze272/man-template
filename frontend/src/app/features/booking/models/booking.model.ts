import {BookingStatus} from './booking-status.model';
import {User} from '../../iam/models/user.model';
import {Room} from './room.model';

export type Booking = {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  date: Date;
  persons: number;
  comment: string;
  bookStatus: BookingStatus;
  user: User;
  room: Room;
}
