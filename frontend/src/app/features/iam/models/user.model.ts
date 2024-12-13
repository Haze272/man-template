import {Role} from './role.model';

export type User = {
  id: number;
  email: string;
  username: string;
  roles: Role[]
}
