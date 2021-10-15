import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: false, unique: true})
  name: string

  @Column({nullable: false})
  nickName: string

  @Column({nullable: false})
  password: string

}