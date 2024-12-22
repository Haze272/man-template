import {
  Column,
  Entity,
  JoinTable,
  ManyToMany, ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Role } from '../../roles/entities/role.entity';
import { UserStatus } from "./user-status.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  patronymic: string;

  @Column()
  phone: string;

  @ManyToOne(() => UserStatus)
  status: UserStatus;
}
