export class CreateRoomDto {
  name: string;
  number: number;
  roomTypeId: number;
  bedCapacity: number;
  description: string;
  pricePerNight: number;
  imageUrl: string;
  extra: string;
  amenityIds: number[];
}
