import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { DB_CONFIG } from "../config/config.js";

const connection = await mysql.createConnection(DB_CONFIG);

export class AuthorModel {
  static async getOrCreate(name: string) {
    const [authorRows] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM author WHERE name = ?`,
      [name]
    );

    if (authorRows.length > 0) {
      return authorRows[0].id;
    } else {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO author (name) VALUES (?)`,
        [name]
      );
      return result.insertId;
    }
  }

  static async getAll() {
    const [authors] = await connection.query("SELECT id, name FROM author;");
    return authors;
  }
}
