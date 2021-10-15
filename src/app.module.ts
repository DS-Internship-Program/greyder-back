import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/user.entity";
import { PostModule } from './post/post.module';
import { PostEntity } from "./post/post.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '192.168.0.250',
      port: 5432,
      username: 'camp',
      password: 'camp20',
      database: 'post_observer',
      entities: [UserEntity, PostEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule, AuthModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
