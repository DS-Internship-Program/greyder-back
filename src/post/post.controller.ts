import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Посты')
@Controller("post")
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private postService: PostService) {
  }

  @ApiOperation({summary: 'Создание таблицы.'})
  @Post("/:name/init")
  create(@Body() body, @Param("name") name, @Request() req) {
    return this.postService.createPost(body, name, req.user);
  }

  @ApiOperation({summary: 'Удаление таблицы.'})
  @Delete("/:name/table")
  dropTable(@Param("name") name, @Request() req) {
    return this.postService.dropTable(name, req.user);
  }

  @ApiOperation({summary: 'Добавление колонки в таблицу.'})
  @Post('/:name/column')
  addColumn(@Body() options, @Param('name') name, @Request() req){
    return this.postService.addColumn(name, options, req.user)
  }

  @ApiOperation({summary: 'Удаление колонки из таблицы.'})
  @Delete("/:name/column")
  removeColumn(@Param("name") name, @Body("column") column, @Request() req) {
    return this.postService.removeColumn(name, column, req.user);
  }

  @ApiOperation({summary: 'Добавление поста в таблицу.'})
  @Post("/:name")
  add(@Body() body, @Param("name") name, @Request() req) {
    return this.postService.addPost(name, body, req.user);
  }

  @ApiOperation({summary: 'Получение постов в таблице.'})
  @Get("/:name")
  get(@Param("name") name, @Query() query, @Request() req) {
    return this.postService.getPosts(name, query, req.user);
  }

  @ApiOperation({summary: 'Обновленеие поста в таблице.'})
  @Put("/:name/:id")
  update(@Body() body, @Param("name") name, @Param("id") id, @Request() req) {
    return this.postService.updatePost(name, body, id, req.user);
  }

  @ApiOperation({summary: 'Удаление поста из таблицы.'})
  @Delete("/:name")
  delete(@Param("name") name, @Query("id") id, @Request() req) {
    return this.postService.deletePost(name, id, req.user);
  }
}
