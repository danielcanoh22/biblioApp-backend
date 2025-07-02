import { PoolConnection } from "mysql2/promise";
import { connection as defaultConnection } from "../db/db.js";
import { UserQueryResult } from "../types/user.js";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export class UserModel {
  static async getByEmail(
    email: string,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const [users] = await db.query<UserQueryResult[]>(
      "SELECT * FROM user WHERE email = ?;",
      [email]
    );

    return users[0];
  }
}
