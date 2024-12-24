export class CreateBookDto {
  userId: number;
  roomId: number;
  dateStartInt: number;
  dateEndInt: number;
  persons: number;
  comment: string;
}
