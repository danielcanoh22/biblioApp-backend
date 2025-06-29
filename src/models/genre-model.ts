import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DB_CONFIG } from "../config/config.js";

const connection = await mysql.createConnection(DB_CONFIG);

export class GenreModel {
  static async getOrCreate(name: string) {
    const [genreRows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM genre WHERE name = ?`,
      [name]
    );
    if (genreRows.length > 0) {
      return genreRows[0].id;
    } else {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO genre (name) VALUES (?)`,
        [name]
      );
      return result.insertId;
    }
  }

  static async getAll() {
    const [genres] = await connection.query("SELECT id, name FROM genre;");
    return genres;
  }
}
