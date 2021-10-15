import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  tableName: string;

  @Column({default: false})
  isWrite: boolean;

  @Column({default: false})
  isRead: boolean;
}