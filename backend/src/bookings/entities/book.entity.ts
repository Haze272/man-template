import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookStatus } from './book-status.entity';
import { User } from '../../users/entities/user.entity';
import { Table } from '../../tables/entities/table.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BookStatus)
  bookStatus: BookStatus;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Table)
  table: Table;

  @Column({ type: 'datetime' })
  bookDate: Date;

  @Column()
  persons: number;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  comment: string;
}
