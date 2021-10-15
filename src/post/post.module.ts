import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from "./post.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./post.entity";

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity]),AuthModule]
})
export class PostModule {}
