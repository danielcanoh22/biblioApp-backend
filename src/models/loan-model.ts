import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connection as defaultConnection } from "../db/db.js";

type LoanData = {
  user_id: number;
  book_id: number;
  due_date: Date;
};

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

  static async getAll() {}
  static async update() {}
  static async delete() {}
}
