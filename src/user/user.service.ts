import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCreateDto } from "../../dist/user/dto/user-create.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  async create(dto: UserCreateDto){
    await this.userRepository.insert(dto)
    return await this.userRepository.create(dto)
  }
  async getAll(){
    const users = await this.userRepository.find()
    return users
  }

  async getUserByName(name: string) {
    const user = await this.userRepository.find({ where: {name} })
    return user[0];
  }
}
