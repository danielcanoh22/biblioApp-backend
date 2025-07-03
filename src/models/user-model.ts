import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { connection, connection as defaultConnection } from "../db/db.js";
import { NewUserData, User } from "../types/user.js";

export class UserModel {
  static async create(data: NewUserData) {
    const { name, email, passwordHash, role } = data;

    const [result] = await connection.query<ResultSetHeader>(
      `
        INSERT INTO user (name, email, password, role) 
        VALUES (?, ?, ?, ?);
      `,
      [name, email, passwordHash, role]
    );

    const newUserId = result.insertId;

    const [userRows] = await connection.query<User[]>(
      `
        SELECT * FROM user
        WHERE id = ?;
      `,
      [newUserId]
    );

    return userRows[0];
  }

  static async getByEmail(
    email: string,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const [users] = await db.query<User[]>(
      "SELECT * FROM user WHERE email = ?;",
      [email]
    );

    return users[0];
  }
}
