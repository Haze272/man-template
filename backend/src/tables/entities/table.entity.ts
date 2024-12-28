import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TableType } from './table-type.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  number: number;

  @ManyToOne(() => TableType)
  tableType: TableType;

  @Column()
  capacity: number;

  @Column()
  description: string;

  @Column()
  bookPrice: number;

  @Column()
  imageUrl: string;

  @Column()
  extra: string;
}
