import { Role } from '../../roles/entities/role.entity';

export type ActiveUserData = {
  sub: number;
  email: string;
  roles: Role[];
};
