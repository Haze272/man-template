import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
