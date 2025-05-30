import mysql from "mysql2/promise";
import { DB_HOST, DB_PASSWORD, DB_SCHEMA, DB_USER } from "../config/config.js";

const config = {
  host: DB_HOST,
  port: 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
};

console.log(config);

const connection = await mysql.createConnection(config);

export class BooksModel {
  static async getAll() {
    const [books] = await connection.query(
      "SELECT title, author_id, genre_id, description, total_copies, available_copies, image, created_at FROM book;"
    );

    return books;
  }
}
