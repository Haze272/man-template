import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomType } from "./room-type.entity";
import { Amenity } from "./amenity.entity";


@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  number: number;

  @ManyToOne(() => RoomType)
  roomType: RoomType;

  @Column()
  bedCapacity: number;

  @Column()
  description: string;

  @Column()
  pricePerNight: number;

  @Column()
  imageUrl: string;

  @Column()
  extra: string;

  @ManyToMany(() => Amenity)
  @JoinTable()
  amenities: Amenity[];
}