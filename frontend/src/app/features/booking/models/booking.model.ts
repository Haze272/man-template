import {BookingStatus} from './booking-status.model';
import {User} from '../../iam/models/user.model';
import {Table} from './table.model';

export type Booking = {
  id: number;
  bookDate: Date | string;
  date: Date;
  persons: number;
  comment: string;
  bookStatus: BookingStatus;
  user: User;
  table: Table;
}
