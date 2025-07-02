import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection } from "../db/db.js";

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
