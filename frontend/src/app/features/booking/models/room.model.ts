import {RoomType} from './room-type.model';
import {Amenity} from './amenity.model';

export type Room = {
  id: number;
  name: string;
  number: number;
  bedCapacity: number;
  description: string;
  pricePerNight: number;
  imageUrl: string;
  extra?: string;
  roomType: RoomType;
  amenities: Amenity[];
}
