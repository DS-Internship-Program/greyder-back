import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user/user.entity";
import { PostModule } from './post/post.module';
import { PostEntity } from "./post/post.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserEntity, PostEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule, AuthModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
