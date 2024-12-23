import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookStatus } from './book-status.entity';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookStatus)
  bookStatus: BookStatus;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Room)
  room: Room;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;

  @Column()
  persons: number;

  @Column()
  date: Date;

  @Column()
  comment: string;
}
