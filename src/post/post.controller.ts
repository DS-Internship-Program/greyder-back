import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('В разработке...')
@Controller("post")
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private postService: PostService) {
  }

  @ApiOperation({summary: 'Создание таблицы.'})
  @Post("/:name/init")
  create(@Body() body, @Param("name") name) {
    return this.postService.createPost(body, name);
  }

  @Post("/:name")
  add(@Body() body, @Param("name") name) {
    return this.postService.addPost(name, body);
  }
  @Put("/:name/:id")
  update(@Body() body, @Param("name") name, @Param("id") id) {
    return this.postService.updatePost(name, body, id);
  }

  @Get("/:name")
  get(@Param("name") name, @Query() query) {
    return this.postService.getPosts(name, query);
  }

  @Delete("/:name")
  delete(@Param("name") name, @Query("id") id) {
    return this.postService.deletePost(name, id);
  }
  @Post('/:name/column')
  addColumn(@Body() options, @Param('name') name){
    return this.postService.addColumn(name, options)
  }
  @Delete("/:name/column")
  removeColumn(@Param("name") name, @Body("column") column) {
    return this.postService.removeColumn(name, column);
  }
}
