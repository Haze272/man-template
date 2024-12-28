import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TableType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
