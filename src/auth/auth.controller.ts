import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}
  @ApiOperation({summary: 'Логин'})
  @ApiBody({type: CreateUserDto})
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }
  @ApiOperation({summary: 'Регистрация'})
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto)
  }
}