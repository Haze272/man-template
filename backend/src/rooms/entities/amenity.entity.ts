import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
