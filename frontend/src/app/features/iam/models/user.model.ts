import {Role} from './role.model';

export type User = {
  id: number;
  email: string;
  username: string;
  roles: Role[];
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  status: UserStatus;
}

export type UserStatus = {
  id: number;
  name: string;
}
