import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Посты")
@Controller("post")
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private postService: PostService) {
  }

  @ApiOperation({ summary: "Получение таблиц.", description: "Получение таблиц пользователя." })
  @Get()
  getPost(@Request() req) {
    return this.postService.getPost(req.user);
  }

  @ApiOperation({
    summary: "Создание таблицы.",
    description: "Таблица саздаётся на основе данных отправленных с клиента. При создании испольховать латиницу и типы данных свойственных для Postgres(varchar, text, integer, null, not null, serial, boolean)"
  })
  @Post("/:name/init")
  create(@Body() body, @Param("name") name, @Request() req) {
    if (body
      && Object.keys(body).length === 0
      && Object.getPrototypeOf(body) === Object.prototype)
      return 'Запрос не может быть пустым. В теле запроса отсутвуют параметры.'
      return this.postService.createPost(body, name, req.user);
  }

  @ApiOperation({ summary: "Удаление таблицы.", description: "Удаление таблицы происходит по параметру названия." })
  @Delete("/:name/table")
  dropTable(@Param("name") name, @Request() req) {
    return this.postService.dropTable(name, req.user);
  }

  @ApiOperation({
    summary: "Добавление колонки в таблицу.",
    description: "Создание таблицы по параметру имени и опций в body"
  })
  @Post("/:name/column")
  addColumn(@Body() options, @Param("name") name, @Request() req) {
    return this.postService.addColumn(name, options, req.user);
  }

  @ApiOperation({
    summary: "Удаление колонки из таблицы.",
    description: "Удаление колонки по названию таблицы в параметрах и названию столбца в body"
  })
  @Delete("/:name/column")
  removeColumn(@Param("name") name, @Body("column") column, @Request() req) {
    return this.postService.removeColumn(name, column, req.user);
  }

  @ApiOperation({
    summary: "Добавление поста в таблицу.",
    description: "Пост добавлятся по названию таблицы в параметрах и на основе body. ВАЖНО, ключи должны совпадать."
  })
  @Post("/:name")
  add(@Body() body, @Param("name") name, @Request() req) {
    return this.postService.addPost(name, body, req.user);
  }

  @ApiOperation({
    summary: "Получение постов в таблице.",
    description: "Получение постов в таблице по названию таблицы в параметрах."
  })
  @Get("/:name")
  get(@Param("name") name, @Query() query, @Request() req) {
    return this.postService.getPosts(name, query, req.user);
  }

  @ApiOperation({
    summary: "Обновленеие поста в таблице.",
    description: "Обновление поста в таблице по названию таблицы и id поста в параметрах."
  })
  @Put("/:name/:id")
  update(@Body() body, @Param("name") name, @Param("id") id, @Request() req) {
    return this.postService.updatePost(name, body, id, req.user);
  }

  @ApiOperation({
    summary: "Удаление поста из таблицы.",
    description: "Удаление поста в таблице по названию таблицы и id поста в параметрах."
  })
  @Delete("/:name/:id")
  delete(@Param("name") name, @Param("id") id, @Request() req) {
    return this.postService.deletePost(name, id, req.user);
  }

  @ApiOperation({ summary: "Получение схемы таблицы.", description: "Получение схемы таблицы по имени в параметрах." })
  @Get("/:name/schema")
  getSchema(@Param("name") name, @Request() req) {
    return this.postService.getSchema(name, req.user);
  }
}
