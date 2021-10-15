import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {UserEntity} from "../user/user.entity";

@Injectable()
export class AuthService {

  constructor(private userService: UserService,
              private jwtService: JwtService) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByName(userDto.name);
    if (candidate) {
      throw new HttpException('Пользователь с таким именем существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({...userDto, password: hashPassword})
    return this.generateToken(user)
  }

  private async generateToken(user: UserEntity) {
    const payload = {name: user.name, id: user.id}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    try{
      const user = await this.userService.getUserByName(userDto.name);
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    }catch (e)
    {
    throw new UnauthorizedException({message: 'Некорректное имя или пароль'})
    }
  }
}