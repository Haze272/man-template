export class CreateBookDto {
  roomId: number;
  dateStart: string | Date;
  dateEnd: string | Date;
  persons: number;
  comment: string;
}
