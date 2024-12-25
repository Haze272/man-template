import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;

  name: string;
  surname: string;
  patronymic: string;
  phone: string;
}
