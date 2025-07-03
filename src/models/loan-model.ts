import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection, connection as defaultConnection } from "../db/db.js";
import {
  GetAllLoansOptions,
  Loan,
  LoanData,
  LoansCountQueryResult,
} from "../types/loan.js";
import { UpdateLoanStatusApiDTO } from "../schemas/loan.js";

export class LoanModel {
  static async create(
    data: LoanData,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const { book_id, user_id, due_date } = data;

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO loan (user_id, book_id, due_date) VALUES (?, ?, ?);
        `,
      [user_id, book_id, due_date]
    );

    const newLoanId = result.insertId;

    const [loanRows] = await db.query<RowDataPacket[]>(
      `
        SELECT 
          l.id,
            l.loan_date,
            l.due_date,
            u.name AS user_name,
            u.email AS user_email,
            u.id AS user_id,
            b.title AS book_title,
            b.id AS book_id
        FROM loan l
        JOIN user u ON l.user_id = u.id
        JOIN book b ON l.book_id = b.id
        WHERE l.id = ?;
      `,
      [newLoanId]
    );

    return loanRows[0];
  }

  static async getAll(options: GetAllLoansOptions) {
    const { filters, pagination } = options;
    const { limit, offset } = pagination;

    const baseQuery = `
      FROM loan l
      JOIN user u ON l.user_id = u.id
      JOIN book b ON l.book_id = b.id
    `;

    const whereClauses: string[] = [];
    const values: (string | number)[] = [];

    if (filters.user_email) {
      whereClauses.push("u.email = ?");
      values.push(filters.user_email);
    }

    if (filters.status) {
      whereClauses.push("l.status = ?");
      values.push(filters.status);
    }

    const whereStr =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countSql = `SELECT COUNT(l.id) AS totalItems ${baseQuery} ${whereStr};`;
    const [countRows] = await connection.query<LoansCountQueryResult[]>(
      countSql,
      values
    );
    const totalItems = countRows[0].totalItems;

    if (totalItems === 0) {
      return { loans: [], totalItems: 0 };
    }

    const dataSql = `
      SELECT 
        l.id,
        l.loan_date,
        l.due_date,
        l.status,
        l.comments,
        u.name AS user_name,
        u.email AS user_email,
        b.title AS book_title
        ${baseQuery}
        ${whereStr}
      ORDER BY
        CASE l.status
          WHEN 'pendiente' THEN 1
          WHEN 'activo'    THEN 2
          WHEN 'atrasado'  THEN 3
          WHEN 'devuelto'  THEN 4
          ELSE 5
        END,
      l.loan_date DESC
      LIMIT ? OFFSET ?;
    `;

    const finalValues = [...values, limit, offset];
    const [loans] = await connection.query<Loan[]>(dataSql, finalValues);

    return { loans, totalItems };
  }

  static async getById(
    id: number | string,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const [loan] = await db.query<RowDataPacket[]>(
      `
        SELECT 
          l.id,
            l.loan_date,
            l.due_date,
            l.status,
            u.name AS user_name,
            u.email AS user_email,
            u.id AS user_id,
            b.title AS book_title,
            b.id AS book_id
        FROM loan l
        JOIN user u ON l.user_id = u.id
        JOIN book b ON l.book_id = b.id
        WHERE l.id = ?;
      `,
      [id]
    );

    if (loan.length === 0) return undefined;

    return loan[0];
  }

  static async updateStatus(
    id: number | string,
    data: UpdateLoanStatusApiDTO,
    db: PoolConnection | typeof defaultConnection = defaultConnection
  ) {
    const fieldsToUpdate = Object.keys(data);
    if (fieldsToUpdate.length === 0) return true;

    const setClause = fieldsToUpdate
      .map((field) => `\`${field}\` = ?`)
      .join(", ");

    const values = Object.values(data);

    const sql = `
        UPDATE loan 
        SET ${setClause}
        WHERE 
          id = ?;
      `;

    const [result] = await db.query<ResultSetHeader>(sql, [...values, id]);

    return result.affectedRows > 0;
  }

  static async delete(id: string | number) {
    const [result] = await connection.query<ResultSetHeader>(
      `
      DELETE FROM loan
      WHERE id = ?;
      `,
      [id]
    );

    return result.affectedRows > 0;
  }
}
