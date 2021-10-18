import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({type: String, description: "name"})
  readonly name: string
  @ApiProperty({type: String, description: "nickName"})
  readonly nickName: string
  @ApiProperty({type: String, description: "password"})
  readonly password: string
}