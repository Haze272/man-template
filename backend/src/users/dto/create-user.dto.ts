export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  statusId?: number;
}
