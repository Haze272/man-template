import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BookStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
