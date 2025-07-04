import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection, connection as defaultConnection } from "../db/db.js";
import {
  CountResult,
  GetAllUsersOptions,
  NewUserData,
  UpdateUserData,
  User,
  UsersCountQueryResult,
} from "../types/user.js";

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

  static async getAll(options: GetAllUsersOptions) {
    const { filters, pagination } = options;
    const { limit, offset } = pagination;

    const whereClauses: string[] = [];
    const values: (string | number)[] = [];

    if (filters.name) {
      whereClauses.push("name LIKE ?");
      values.push(`%${filters.name}%`);
    }

    if (filters.email) {
      whereClauses.push("email LIKE ?");
      values.push(`%${filters.email}%`);
    }

    const whereStr =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countSql = `SELECT COUNT(id) AS totalItems FROM user ${whereStr};`;
    const [countRows] = await connection.query<UsersCountQueryResult[]>(
      countSql,
      values
    );
    const totalItems = countRows[0].totalItems;

    if (totalItems === 0) {
      return { users: [], totalItems: 0 };
    }

    const dataSql = `
      SELECT 
        id, name, email, role, created_at
      FROM user
      ${whereStr}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?;
    `;

    const finalValues = [...values, limit, offset];
    const [users] = await connection.query<RowDataPacket[]>(
      dataSql,
      finalValues
    );

    return { users, totalItems };
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

  static async getById(
    id: string | number,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const [users] = await db.query<User[]>(
      "SELECT id, name, email, role, created_at FROM user WHERE id = ?",
      [id]
    );

    return users[0] as Omit<User, "password"> | undefined;
  }

  static async update(
    id: number | string,
    data: UpdateUserData
  ): Promise<boolean> {
    const fieldsToUpdate = Object.keys(data);
    if (fieldsToUpdate.length === 0) {
      return true;
    }

    const setClause = fieldsToUpdate
      .map((field) => `\`${field}\` = ?`)
      .join(", ");
    const values = Object.values(data);

    const sql = `UPDATE user SET ${setClause} WHERE id = ?;`;

    const [result] = await connection.query<ResultSetHeader>(sql, [
      ...values,
      id,
    ]);

    return result.affectedRows > 0;
  }

  static async delete(id: number | string): Promise<boolean> {
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM user WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async countAdmins(): Promise<number> {
    const [rows] = await connection.query<CountResult[]>(
      "SELECT COUNT(*) as count FROM user WHERE role = 'admin';"
    );
    return rows[0].count;
  }
}
