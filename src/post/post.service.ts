import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "./post.entity";

const regex = new RegExp(/[ !+/*-]/);

const db = new Pool({
  host: "192.168.0.250",
  database: "post_observer",
  user: "camp",
  password: "camp20",
  port: 5432
});

//function for create table in db
const create = async (tableName, options) => {
  const sql = [];
  for (let key in options) {
    sql.push(`"${key}" ${options[key].split(", ").map(name => name.toUpperCase()).join(" ")}`);
  }
  await db.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (${sql})`);
};
//function for add post to table
const add = async (tableName, options) => {
  const sql = [[], [], []];
  for (let key in options) {
    sql[0].push(`"${key}"`);
    sql[1].push("$" + sql[0].length);
    sql[2].push(options[key]);
  }
  await db.query(`INSERT INTO "${tableName}" (${sql[0]}) VALUES (${sql[1]})`, sql[2]);
};
//function for delete post from table
const deletePost = async (tableName, id) => {
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
};
//function for add column to table
const addColumn = async (name, options) => {
  const sql = [];
  for (let key in options) {
    sql.push(`"${key}" ${options[key].split(", ").map(name => name.toUpperCase()).join(" ")}`);
  }
  await db.query(`ALTER TABLE "${name}" ADD COLUMN ${sql}`);
};
//function for remove column to table
const removeColumn = async (name, column) => {
  await db.query(`ALTER TABLE "${name}" DROP COLUMN "${column}"`);
};
//function for update post
const updatePost = async (name, options, id) => {
  const sql = [];
  for (let key in options) {
    sql.push(`"${key}" = '${options[key]}'`);
  }
  await db.query(`UPDATE ${name} SET ${sql} WHERE id = ${id}`);
};

@Injectable()
export class PostService {
  constructor(@InjectRepository(PostEntity) private postRepository: Repository<PostEntity>) {
  }

  async createPost(body, name, user) {
    const { isWritePrivate, isReadPrivate, ...options } = body;
    if (name !== name.toLowerCase() || regex.test(name)) {
      return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
    }
    const { rows } = await db.query(`SELECT * FROM information_schema.tables WHERE table_catalog = 'post_observer' AND table_name = '${name}'`);
    if (rows.length !== 0) return "Таблица с таким именем уже есть в базе.";
    if (options["id"] === undefined) {
      options.id = "serial, primary key";
    }
    await create(name, options);
    await this.postRepository.insert({ tableName: name, userId: user.id, isWritePrivate: !!isWritePrivate, isReadPrivate: !!isReadPrivate });
    return "Ваша таблица успесншно создана.";
  }

  async dropTable(name, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id){
        return 'Вы не можете удалить эту таблицу.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      await db.query(`DROP TABLE ${name}`);
      return `Таблица ${name} успешно удалена.`;
    } catch (e) {
      return `У вас нет такой таблицы.`;
    }

  }

  async addPost(name, body, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id && access[0].isWritePrivate){
        return 'Вы не можете добавить пост в эту таблицу.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      await add(name, body);
      return "Ваш пост успесншно создан.";
    } catch (e) {
      return "Что-то пошло не так. Перепроверьте данные.";
    }
  }

  async getPosts(name, query, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id && access[0].isReadPrivate){
        return 'Вы не можете прочитать посты в этой таблице.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      const { limit, page } = query;
      const { rows } = limit && page ? await db.query(`SELECT * FROM "${name}" LIMIT ${limit} OFFSET ${(page - 1) * limit}`) : await db.query(`SELECT * FROM "${name}" LIMIT 1000`);
      return rows;
    } catch (e) {
      return "Что-то пошло не так. Перепроверьте данные.";
    }

  }

  async deletePost(name, id, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id && access[0].isReadPrivate){
        return 'Вы не можете удалять посты в этой таблице.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      await deletePost(name, id);
      return "Пост успешно удалён";
    } catch (e) {
      return "Что то пошло не так";
    }
  }

  async updatePost(name, options, id, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id && access[0].isReadPrivate){
        return 'Вы не можете обновлять посты в этой таблице.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      await updatePost(name, options, id);
      return "Пост успешно обновлён.";
    } catch (e) {
      return e.routine === "transformUpdateTargetList" ? "Столбца с таким именем не существует." : "Введите данные правильного типа.";
    }

  }

  async addColumn(name, options, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id){
        return 'Вы не можете обновлять эту таблицу.'
      }
      if (name !== name.toLowerCase() || regex.test(name)) {
        return "Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .";
      }
      await addColumn(name, options);
      return "Новый столбец успешно добавлен.";
    } catch (e) {
      return e.routine === "typenameType" ? "Перепроверьте данные." : "Столбец с таким названием уже существует";
    }
  }

  async removeColumn(name, column, user) {
    try {
      const access = await this.postRepository.find({ where: { tableName: name} });
      if (access[0].tableName === undefined) return 'Такой таблицы в базе нет.'

      if(access[0].userId !== user.id && access[0].isReadPrivate){
        return 'Вы не можете обновлять эту таблицу.'
      }
      if (name !== name.toLowerCase()) {
        return "Название таблицы должно быть в нижнем регистре.";
      }
      await removeColumn(name, column);
      return "Столюец успешно удалён.";
    } catch (e) {
      return "Столбца с таким названием не существует.";
    }

  }
}
